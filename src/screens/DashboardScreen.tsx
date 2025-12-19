import { useMemo } from 'react';
import { Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EChartWrapper } from '../components/common/EChartWrapper';
import { useHabitsData } from '../hooks/useHabitsData';

// TODO: Add goal progress tracking and recent activity feed
export const DashboardScreen = () => {
  /**
   * Use our custom hook to get habits data
   * This hook handles:
   * - Loading habits from database
   * - Showing loading state
   * - Handling errors
   * - Auto-refreshing when data changes
   */
  const { habits, loading, error } = useHabitsData();

  // Color palette for charts (different colors for each habit)
  const colors = ['#1a7fe6', '#34d399', '#f472b6', '#fbbf24', '#a78bfa', '#fb923c'];

  /**
   * Calculate statistics from habits data
   * This runs automatically when habits change
   */
  const stats = useMemo(() => {
    // Add up all the hours from all habits
    const totalHours = habits.reduce((sum, h) => sum + h.total_hours, 0);
    
    // Count total number of habits
    const totalHabits = habits.length;
    
    // Calculate average hours per habit
    const avgHours = totalHabits > 0 ? (totalHours / totalHabits).toFixed(1) : 0;
    
    // Find the habit with most hours logged
    const mostActiveHabit = habits.length > 0 
      ? habits.reduce((max, h) => h.total_hours > max.total_hours ? h : max)
      : null;

    return { totalHours, totalHabits, avgHours, mostActiveHabit };
  }, [habits]);

  /**
   * Create the pie chart configuration
   * This automatically updates when habits change
   */
  const pieChartOption = useMemo(() => {
    // Only show habits that have logged hours
    const activeHabits = habits.filter(h => h.total_hours > 0);
    
    // If no habits have hours, don't show the chart
    if (activeHabits.length === 0) {
      return null;
    }

    // Convert habits data into chart data format
    const chartData = activeHabits.map((habit, index) => ({
      value: habit.total_hours,
      name: habit.name,
      itemStyle: {
        color: colors[index % colors.length], // Assign a color from our palette
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
  }, [habits]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#030712]">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1a7fe6" />
          <Text className="text-gray-400 mt-4">Loading dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#030712]">
      <ScrollView className="flex-1 p-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-2xl font-bold text-white">Dashboard</Text>
          <Text className="text-gray-400 text-sm mt-1">
            Welcome back! Here's your progress summary
          </Text>
        </View>

        {error && (
          <View className="bg-red-900/20 border border-red-500 rounded-lg p-3 mb-4">
            <Text className="text-red-400">{error}</Text>
          </View>
        )}

        {/* Quick Stats Cards */}
        <View className="flex-row flex-wrap gap-3 mb-6">
          <View className="flex-1 min-w-[45%] rounded-2xl border border-white/10 bg-white/5 p-4">
            <Text className="text-sm text-white/60 mb-1">Total Habits</Text>
            <Text className="text-3xl font-bold text-white">{stats.totalHabits}</Text>
          </View>
          
          <View className="flex-1 min-w-[45%] rounded-2xl border border-white/10 bg-white/5 p-4">
            <Text className="text-sm text-white/60 mb-1">Total Hours</Text>
            <Text className="text-3xl font-bold text-white">{stats.totalHours}</Text>
          </View>

          <View className="flex-1 min-w-[45%] rounded-2xl border border-white/10 bg-white/5 p-4">
            <Text className="text-sm text-white/60 mb-1">Average Hours</Text>
            <Text className="text-3xl font-bold text-white">{stats.avgHours}</Text>
          </View>

          <View className="flex-1 min-w-[45%] rounded-2xl border border-white/10 bg-white/5 p-4">
            <Text className="text-sm text-white/60 mb-1">Most Active</Text>
            <Text className="text-lg font-bold text-white truncate">
              {stats.mostActiveHabit ? stats.mostActiveHabit.name : 'N/A'}
            </Text>
            {stats.mostActiveHabit && (
              <Text className="text-xs text-white/60 mt-1">
                {stats.mostActiveHabit.total_hours}h logged
              </Text>
            )}
          </View>
        </View>
        
        {/* Pie Chart Card */}
        {pieChartOption ? (
          <View className="mb-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4">
            <EChartWrapper 
              option={pieChartOption as any} 
              height={300}
              backgroundColor="transparent"
            />
          </View>
        ) : (
          <View className="mb-6 rounded-3xl border border-white/10 bg-white/5 p-8">
            <Text className="text-center text-gray-400 text-lg mb-2">
              No data to display
            </Text>
            <Text className="text-center text-gray-500 text-sm">
              Start tracking your habits to see your progress here
            </Text>
          </View>
        )}

        {/* Habits List */}
        <View className="rounded-2xl border border-white/10 bg-white/5 p-4 mb-6">
          <Text className="text-lg font-semibold text-white mb-3">Your Habits</Text>
          {habits.length === 0 ? (
            <Text className="text-gray-400 text-center py-4">
              No habits yet. Create one to get started!
            </Text>
          ) : (
            habits.map((habit, index) => (
              <View 
                key={habit.id} 
                className="flex-row items-center justify-between py-3 border-b border-white/10"
              >
                <View className="flex-1">
                  <Text className="text-white font-medium">{habit.name}</Text>
                  {habit.description && (
                    <Text className="text-gray-400 text-sm mt-1" numberOfLines={1}>
                      {habit.description}
                    </Text>
                  )}
                </View>
                <View className="items-end ml-3">
                  <Text className="text-white font-bold">{habit.total_hours}h</Text>
                  <View 
                    className="w-3 h-3 rounded-full mt-1"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                </View>
              </View>
            ))
          )}
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
};
