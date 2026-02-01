import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Header } from '../components/layout';
import { Card, Button, NumberInput, Modal } from '../components/common';
import { db } from '../db/database';
import type { BodyMetric, MuscleBalance } from '../types';
import { muscleBalanceService, type BalanceRecommendation } from '../services/muscleBalanceService';
import { formatDateShort } from '../utils/dateUtils';
import { MUSCLE_GROUP_COLORS, MUSCLE_GROUP_LABELS } from '../constants/exercises';
import { v4 as uuidv4 } from 'uuid';

export function MetricsPage() {
  const [metrics, setMetrics] = useState<BodyMetric[]>([]);
  const [muscleBalance, setMuscleBalance] = useState<MuscleBalance | null>(null);
  const [recommendations, setRecommendations] = useState<BalanceRecommendation[]>([]);
  const [showAddMetric, setShowAddMetric] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const bodyMetrics = await db.bodyMetrics.orderBy('date').reverse().limit(30).toArray();
    setMetrics(bodyMetrics);

    const balance = await muscleBalanceService.getWeeklyMuscleBalance();
    setMuscleBalance(balance);

    const recs = await muscleBalanceService.getWeeklyRecommendations();
    setRecommendations(recs);
  };

  const handleAddMetric = async (weight: number, waist: number) => {
    await db.bodyMetrics.add({
      id: uuidv4(),
      date: new Date(),
      weight: weight || undefined,
      waist: waist || undefined,
    });
    setShowAddMetric(false);
    loadData();
  };

  const chartData = [...metrics]
    .reverse()
    .map((m) => ({
      date: formatDateShort(new Date(m.date)),
      weight: m.weight,
      waist: m.waist,
    }));

  const totalBalance = muscleBalance
    ? Object.values(muscleBalance).reduce((sum, v) => sum + v, 0)
    : 0;

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <Header
        title="Metrics"
        rightAction={
          <button
            onClick={() => setShowAddMetric(true)}
            className="p-2 text-blue-600 dark:text-blue-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        }
      />

      <main className="flex-1 p-4 space-y-6">
        {/* Weight/Waist Chart */}
        <Card>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Progress</h2>
          {chartData.length > 1 ? (
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6' }}
                    name="Weight (kg)"
                  />
                  <Line
                    type="monotone"
                    dataKey="waist"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981' }}
                    name="Waist (cm)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <p>Not enough data to show chart</p>
                <Button className="mt-2" size="sm" onClick={() => setShowAddMetric(true)}>
                  Add Measurement
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Muscle Balance */}
        <Card>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
            Weekly Muscle Balance
          </h2>
          {totalBalance > 0 ? (
            <div className="space-y-3">
              {Object.entries(muscleBalance || {}).map(([group, time]) => {
                const percentage = (time / totalBalance) * 100;
                return (
                  <div key={group}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-700 dark:text-gray-300">
                        {MUSCLE_GROUP_LABELS[group]}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {Math.round(percentage)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: MUSCLE_GROUP_COLORS[group],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              Complete workouts to see muscle balance
            </p>
          )}
        </Card>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <Card>
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Insights</h2>
            <div className="space-y-3">
              {recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl ${
                    rec.type === 'warning'
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                      : rec.type === 'success'
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                      : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {rec.type === 'warning' && (
                      <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    )}
                    {rec.type === 'success' && (
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {rec.type === 'info' && (
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    <p className={`text-sm ${
                      rec.type === 'warning'
                        ? 'text-yellow-800 dark:text-yellow-200'
                        : rec.type === 'success'
                        ? 'text-green-800 dark:text-green-200'
                        : 'text-blue-800 dark:text-blue-200'
                    }`}>
                      {rec.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>

      <AddMetricModal
        isOpen={showAddMetric}
        onClose={() => setShowAddMetric(false)}
        onSave={handleAddMetric}
      />
    </div>
  );
}

interface AddMetricModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (weight: number, waist: number) => void;
}

function AddMetricModal({ isOpen, onClose, onSave }: AddMetricModalProps) {
  const [weight, setWeight] = useState(70);
  const [waist, setWaist] = useState(80);

  const handleSave = () => {
    onSave(weight, waist);
    setWeight(70);
    setWaist(80);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Measurement">
      <div className="space-y-4">
        <NumberInput
          value={weight}
          onChange={setWeight}
          min={30}
          max={200}
          step={0.5}
          label="Weight"
          unit="kg"
        />
        <NumberInput
          value={waist}
          onChange={setWaist}
          min={50}
          max={150}
          step={0.5}
          label="Waist"
          unit="cm"
        />
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" onClick={onClose} fullWidth>
            Cancel
          </Button>
          <Button onClick={handleSave} fullWidth>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}
