import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableOpacity,
} from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CircularProgress = ({ size = 148, strokeWidth = 16, progress = 0.64, calories = 544 }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1500,
      useNativeDriver: true,
    }).start();
  }, [progress]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, circumference * (1 - progress)],
  });

  return (
    <View style={styles.progressContainer}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#DEF7EC"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#10B981"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </G>
      </Svg>
      <View style={styles.progressText}>
        <Text style={styles.caloriesNumber}>{calories}</Text>
        <Text style={styles.caloriesLabel}>kcal left</Text>
      </View>
    </View>
  );
};

const StatChip = ({ icon, value, label, color, bgColor }) => (
  <View style={[styles.statChip, { backgroundColor: bgColor }]}>
    <Text style={styles.statIcon}>{icon}</Text>
    <View>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  </View>
);

const MealItem = ({ name, calories }) => (
  <View style={styles.mealItem}>
    <Text style={styles.mealName}>{name}</Text>
    <Text style={styles.mealCalories}>{calories}kcal</Text>
  </View>
);

const MacroItem = ({ icon, label, value }) => (
  <View style={styles.macroItem}>
    <Text style={styles.macroIcon}>{icon}</Text>
    <Text style={styles.macroLabel}>{label}</Text>
    <View style={styles.macroBar}>
      <View style={styles.macroBarFill} />
    </View>
    <Text style={styles.macroValue}>{value}</Text>
  </View>
);

const MealsScreen = () => {
  const meals = [
    { name: 'French toast', calories: 250 },
    { name: 'Greek yogurt with apple', calories: 350 },
    { name: 'Breaded chicken, salad, potato', calories: 580 },
    { name: 'Coffee and milk', calories: 80 },
  ];

  const macros = [
    { icon: '🥩', label: 'Name', value: '79.8g' },
    { icon: '🍞', label: 'Carbs', value: '79.8g' },
    { icon: '🥑', label: 'Fats', value: '79.8g' },
    { icon: '🥬', label: 'Fiber', value: '79.8g' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Meals</Text>
        <View style={styles.dateSelector}>
          <TouchableOpacity>
            <Text style={styles.dateArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.dateText}>Yesterday</Text>
          <TouchableOpacity>
            <Text style={styles.dateArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Calories Today Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Calories today</Text>

        <View style={styles.caloriesContent}>
          <CircularProgress progress={0.64} calories={544} />

          <View style={styles.statsColumn}>
            <StatChip
              icon="🏌️"
              value="1500"
              label="Base goal"
              color="#10B981"
              bgColor="#DEF7EC"
            />
            <StatChip
              icon="🥑"
              value="1136"
              label="Food"
              color="#10B981"
              bgColor="#DEF7EC"
            />
            <StatChip
              icon="🏄"
              value="+355"
              label="Movement"
              color="#3B82F6"
              bgColor="#DBEAFE"
            />
          </View>
        </View>

        <Text style={styles.formula}>1500 - 1136 +180 = 550</Text>
      </View>

      {/* What Did You Eat Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>What did you eat</Text>

        {meals.map((meal, index) => (
          <MealItem key={index} name={meal.name} calories={meal.calories} />
        ))}

        <TouchableOpacity style={styles.moreMeals}>
          <Text style={styles.moreMealsText}>+ 8 meals</Text>
        </TouchableOpacity>
      </View>

      {/* Macros Today Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Macros today</Text>

        {macros.map((macro, index) => (
          <MacroItem
            key={index}
            icon={macro.icon}
            label={macro.label}
            value={macro.value}
          />
        ))}

        <TouchableOpacity style={styles.moreMacros}>
          <Text style={styles.moreMacrosText}>+ 15 Micronutrients</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  backIcon: {
    fontSize: 20,
    color: '#000',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dateArrow: {
    fontSize: 18,
    color: '#666',
    paddingHorizontal: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#000',
    marginHorizontal: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 24,
    marginBottom: 16,
    padding: 20,
  },
  cardTitle: {
    fontSize: 18,
    color: '#999',
    marginBottom: 20,
  },
  caloriesContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  caloriesNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#56B683',
  },
  caloriesLabel: {
    fontSize: 14,
    color: '#56B683',
  },
  statsColumn: {
    gap: 8,
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    minWidth: 120,
  },
  statIcon: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  formula: {
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  mealName: {
    fontSize: 16,
    color: '#000',
  },
  mealCalories: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  moreMeals: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  moreMealsText: {
    fontSize: 14,
    color: '#999',
  },
  macroItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  macroIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  macroLabel: {
    fontSize: 16,
    color: '#000',
    width: 80,
  },
  macroBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  macroBarFill: {
    width: '75%',
    height: '100%',
    backgroundColor: '#DEF7EC',
    borderRadius: 4,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
    width: 50,
    textAlign: 'right',
  },
  moreMacros: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  moreMacrosText: {
    fontSize: 14,
    color: '#999',
  },
  bottomSpacer: {
    height: 40,
  },
});

export default MealsScreen;
