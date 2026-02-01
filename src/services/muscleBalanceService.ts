import type { MuscleGroup, MuscleBalance } from '../types';
import { db } from '../db/database';
import { getStartOfWeek, getEndOfWeek, DAYS_OF_WEEK } from '../utils/dateUtils';

export interface BalanceRecommendation {
  type: 'warning' | 'info' | 'success';
  message: string;
}

export class MuscleBalanceService {
  async getWeeklyMuscleBalance(date: Date = new Date()): Promise<MuscleBalance> {
    const startOfWeek = getStartOfWeek(date);
    const endOfWeek = getEndOfWeek(date);
    endOfWeek.setHours(23, 59, 59, 999);

    const workouts = await db.workouts
      .where('date')
      .between(startOfWeek, endOfWeek, true, true)
      .toArray();

    const balance: MuscleBalance = {
      push: 0,
      pull: 0,
      legs: 0,
      core: 0,
      cardio: 0,
      'full-body': 0,
    };

    for (const workout of workouts) {
      for (const exerciseLog of workout.exercises) {
        const exercise = await db.exercises.get(exerciseLog.exerciseId);
        if (exercise) {
          const totalDuration = exerciseLog.sets.reduce((sum, set) => sum + set.duration, 0);
          balance[exercise.muscleGroup] += totalDuration;
        }
      }
    }

    return balance;
  }

  calculateBalanceScore(balance: MuscleBalance): number {
    const values = Object.values(balance);
    const total = values.reduce((sum, v) => sum + v, 0);
    if (total === 0) return 0;

    // Calculate how evenly distributed the muscle groups are
    const target = total / 6; // 6 muscle groups
    const deviations = values.map((v) => Math.abs(v - target));
    const avgDeviation = deviations.reduce((sum, d) => sum + d, 0) / 6;

    // Convert to 0-100 score (lower deviation = higher score)
    const score = Math.max(0, 100 - (avgDeviation / target) * 50);
    return Math.round(score);
  }

  async getRestDayRecommendations(): Promise<BalanceRecommendation[]> {
    const recommendations: BalanceRecommendation[] = [];
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Get yesterday's workouts
    const startOfYesterday = new Date(yesterday);
    startOfYesterday.setHours(0, 0, 0, 0);
    const endOfYesterday = new Date(yesterday);
    endOfYesterday.setHours(23, 59, 59, 999);

    const yesterdayWorkouts = await db.workouts
      .where('date')
      .between(startOfYesterday, endOfYesterday, true, true)
      .toArray();

    if (yesterdayWorkouts.length === 0) {
      return recommendations;
    }

    // Get muscle groups worked yesterday
    const workedYesterday = new Set<MuscleGroup>();
    for (const workout of yesterdayWorkouts) {
      for (const exerciseLog of workout.exercises) {
        const exercise = await db.exercises.get(exerciseLog.exerciseId);
        if (exercise) {
          workedYesterday.add(exercise.muscleGroup);
        }
      }
    }

    // Check week schedule for today
    const schedule = await db.weekSchedule.get('default');
    if (schedule) {
      const dayIndex = today.getDay();
      const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
      const todayDay = DAYS_OF_WEEK[adjustedIndex];
      const scheduledRoutineId = schedule.assignments[todayDay];

      if (scheduledRoutineId) {
        const routine = await db.routines.get(scheduledRoutineId);
        if (routine) {
          // Check if scheduled routine targets same muscles
          for (const step of routine.steps) {
            const exercise = await db.exercises.get(step.exerciseId);
            if (exercise && workedYesterday.has(exercise.muscleGroup)) {
              recommendations.push({
                type: 'warning',
                message: `You worked ${exercise.muscleGroup} yesterday. Consider a rest day or targeting different muscles.`,
              });
              break;
            }
          }
        }
      }
    }

    return recommendations;
  }

  async getWeeklyRecommendations(): Promise<BalanceRecommendation[]> {
    const recommendations: BalanceRecommendation[] = [];
    const balance = await this.getWeeklyMuscleBalance();
    const total = Object.values(balance).reduce((sum, v) => sum + v, 0);

    if (total === 0) {
      recommendations.push({
        type: 'info',
        message: 'Start your first workout to see muscle balance insights!',
      });
      return recommendations;
    }

    const percentages = Object.entries(balance).map(([group, time]) => ({
      group: group as MuscleGroup,
      percentage: (time / total) * 100,
    }));

    // Find underworked muscle groups (less than 10% when there's activity)
    const underworked = percentages.filter((p) => p.percentage < 10 && p.percentage > 0);
    const neglected = percentages.filter((p) => p.percentage === 0);

    for (const { group } of neglected) {
      recommendations.push({
        type: 'warning',
        message: `You haven't worked ${group} this week. Consider adding some ${group} exercises.`,
      });
    }

    for (const { group, percentage } of underworked) {
      recommendations.push({
        type: 'info',
        message: `${group} is only ${Math.round(percentage)}% of your weekly training. Consider balancing it out.`,
      });
    }

    // Check for overworked groups (more than 40%)
    const overworked = percentages.filter((p) => p.percentage > 40);
    for (const { group, percentage } of overworked) {
      recommendations.push({
        type: 'warning',
        message: `${group} makes up ${Math.round(percentage)}% of your training. Consider more variety.`,
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        type: 'success',
        message: 'Great job! Your muscle group balance is looking good this week.',
      });
    }

    return recommendations;
  }
}

export const muscleBalanceService = new MuscleBalanceService();
