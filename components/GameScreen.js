import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const GRID_SIZE = 5;
const BOX_SIZE = (width - 60) / GRID_SIZE;

const GameScreen = () => {
  const [numbers, setNumbers] = useState([]);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const scaleAnims = React.useRef(
    numbers.map(() => new Animated.Value(1))
  ).current;

  useEffect(() => {
    generateNewGame(level);
  }, [level]);

  const generateNewGame = (level) => {
    const maxNumber = level * 100;
    const newNumbers = [];
    while (newNumbers.length < GRID_SIZE * GRID_SIZE) {
      const num = Math.floor(Math.random() * maxNumber) + 1;
      if (!newNumbers.includes(num)) {
        newNumbers.push(num);
      }
    }
    setNumbers(newNumbers);
    setSelectedNumbers([]);
    setScore(0);
  };

  const handleNumberPress = (number, index) => {
    if (selectedNumbers.includes(number)) {
      return;
    }

    Animated.spring(scaleAnims[index], {
      toValue: 0.8,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();

    if (number % 7 === 0) {
      setSelectedNumbers([...selectedNumbers, number]);
      setScore(score + 1);
      const divisibleCount = numbers.filter((n) => n % 7 === 0).length;
      if (selectedNumbers.length + 1 === divisibleCount) {
        Alert.alert(
          'Congratulations!',
          `You completed level ${level}!`,
          [{ text: 'Next Level', onPress: () => setLevel(level + 1) }]
        );
      }
    } else {
      Alert.alert('Oops!', 'Select only numbers divisible by 7');
    }
  };

  return (
    <LinearGradient
      colors={['#6A11CB', '#2575FC']}
      style={styles.container}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>7 Divisible</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>Level: {level}</Text>
          <Text style={styles.statsText}>Score: {score}</Text>
        </View>
      </View>
      <View style={styles.gridContainer}>
        {numbers.map((number, index) => (
          <Animated.View
            key={index}
            style={[
              styles.gridItem,
              {
                transform: [{ scale: scaleAnims[index] }],
                backgroundColor: selectedNumbers.includes(number) 
                  ? '#4CAF50' 
                  : number % 7 === 0 
                    ? '#FF6B6B' 
                    : '#FFFFFF'
              }
            ]}
          >
            <TouchableOpacity 
              onPress={() => handleNumberPress(number, index)}
              style={styles.gridItemTouchable}
            >
              <Text style={styles.gridItemText}>{number}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
      <TouchableOpacity 
        style={styles.resetButton} 
        onPress={() => generateNewGame(level)}
      >
        <Text style={styles.resetButtonText}>Reset Game</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  headerContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    padding: 10,
  },
  statsText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: width - 40,
  },
  gridItem: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    margin: 5,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gridItemTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridItemText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  resetButton: {
    marginTop: 20,
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 3,
  },
  resetButtonText: {
    color: '#6A11CB',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GameScreen;