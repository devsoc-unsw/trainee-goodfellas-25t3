import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMemo } from 'react';

import { EChartWrapper } from '../components/common/EChartWrapper';

export const DashboardScreen = () => {
  const mockHabits = [
    { name: 'Deep Work', hours: 25, color: '#1a7fe6' },
    { name: 'Exercise', hours: 15, color: '#34d399' },
    { name: 'Reading', hours: 10, color: '#f472b6' },
  ];

  const pieChartOption = useMemo(() => {
    const chartData = mockHabits.map((habit) => ({
      value: habit.hours,
      name: habit.name,
      itemStyle: {
        color: habit.color,
      },
    }));

    return {
      backgroundColor: 'transparent',
      title: {
        text: 'Habit Time Distribution',
        left: 'center',
        top: 20,
        textStyle: {
          color: '#ffffff',
          fontSize: 16,
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}h ({d}%)',
      },
      legend: {
        orient: 'horizontal',
        bottom: 10,
        textStyle: {
          color: '#ffffff80',
          fontSize: 11,
        },
      },
      series: [
        {
          name: 'Time Spent',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#030712',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              color: '#ffffff',
              formatter: '{b}\n{c}h',
            },
          },
          labelLine: {
            show: false,
          },
          data: chartData,
        },
      ],
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-[#030712]">
      <ScrollView className="flex-1 p-6">
        <Text className="mb-4 text-2xl font-bold text-white">Dashboard</Text>
        
        {/* Pie Chart Card */}
        <View className="mb-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4">
          <EChartWrapper 
            option={pieChartOption as any} 
            height={300}
            backgroundColor="transparent"
          />
        </View>

        {/* Stats Summary */}
        <View className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <Text className="mb-2 text-sm uppercase text-white/60">Summary</Text>
          <Text className="text-base text-white">
            Total: {mockHabits.reduce((sum, h) => sum + h.hours, 0)} hours logged
          </Text>
          <Text className="mt-1 text-sm text-white/60">
            📊 YEPPPPPPPPPPPPP
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
