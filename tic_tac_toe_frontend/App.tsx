import React, { useCallback, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
  Animated,
  Easing,
} from 'react-native';

/**
 * Ocean Professional Theme
 * - primary: #2563EB
 * - secondary/success: #F59E0B
 * - error: #EF4444
 * - background: #f9fafb
 * - surface: #ffffff
 * - text: #111827
 */
const theme = {
  primary: '#2563EB',
  secondary: '#F59E0B',
  success: '#F59E0B',
  error: '#EF4444',
  background: '#f9fafb',
  surface: '#ffffff',
  text: '#111827',
};

// Types
type Player = 'X' | 'O';
type CellValue = Player | null;

const initialBoard: CellValue[] = Array(9).fill(null);

// PUBLIC_INTERFACE
export default function App() {
  /**
   * GAME STATE
   */
  const [board, setBoard] = useState<CellValue[]>(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [winner, setWinner] = useState<Player | 'Draw' | null>(null);
  const [moveCount, setMoveCount] = useState<number>(0);

  // Animation references for subtle transitions
  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const scaleAnim = useMemo(() => new Animated.Value(0.98), []);

  // Start subtle entrance animation
  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 450,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        bounciness: 8,
        speed: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  /**
   * Compute winner when board changes
   */
  React.useEffect(() => {
    const result = calculateWinner(board);
    if (result) {
      setWinner(result);
    } else if (moveCount === 9) {
      setWinner('Draw');
    }
  }, [board, moveCount]);

  /**
   * Handle tapping on a cell
   */
  const handleCellPress = useCallback(
    (index: number) => {
      if (board[index] || winner) return; // ignore if filled or game over

      const nextBoard = board.slice();
      nextBoard[index] = currentPlayer;
      setBoard(nextBoard);
      setMoveCount((c) => c + 1);
      setCurrentPlayer((p) => (p === 'X' ? 'O' : 'X'));
    },
    [board, currentPlayer, winner]
  );

  /**
   * Reset game to initial state with smooth card reset animation
   */
  const handleReset = useCallback(() => {
    // Subtle shrink then expand for feedback
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 120,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0.92,
          duration: 80,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          bounciness: 10,
          speed: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();

    setBoard(initialBoard);
    setCurrentPlayer('X');
    setWinner(null);
    setMoveCount(0);
  }, [fadeAnim, scaleAnim]);

  /**
   * Derived UI values
   */
  const statusText = useMemo(() => {
    if (winner === 'Draw') return "It's a draw!";
    if (winner === 'X' || winner === 'O') return `Winner: ${winner}`;
    return `Turn: ${currentPlayer}`;
  }, [winner, currentPlayer]);

  const statusColor = useMemo(() => {
    if (winner === 'Draw') return theme.secondary;
    if (winner === 'X' || winner === 'O') return theme.primary;
    return theme.text;
  }, [winner]);

  const descriptionText = useMemo(() => {
    if (!winner) return 'Tap a tile to place your mark.';
    if (winner === 'Draw') return 'Great match! Reset to play again.';
    return 'Congratulations! Reset to play another round.';
  }, [winner]);

  /**
   * RENDER
   */
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Header / Status */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>
            Tic Tac Toe
          </Text>
          <Text style={[styles.status, { color: statusColor }]}>{statusText}</Text>
          <Text style={styles.description}>{descriptionText}</Text>
        </View>

        {/* Board */}
        <View style={styles.card}>
          {/* Gradient-like effect using nested surfaces */}
          <View style={styles.cardInset}>
            <Board
              board={board}
              onCellPress={handleCellPress}
              disabled={!!winner}
              currentPlayer={currentPlayer}
            />
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <PrimaryButton
            label={winner ? 'Play Again' : 'Reset'}
            onPress={handleReset}
            variant={winner ? 'primary' : 'surface'}
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Ocean Professional • Clean & Modern</Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

/**
 * Board component renders a 3x3 grid of cells.
 */
function Board({
  board,
  onCellPress,
  disabled,
  currentPlayer,
}: {
  board: CellValue[];
  onCellPress: (index: number) => void;
  disabled: boolean;
  currentPlayer: Player;
}) {
  // Render each cell with a slight press feedback animation
  const renderItem = useCallback(
    ({ item, index }: { item: CellValue; index: number }) => (
      <Cell
        key={index}
        value={item}
        onPress={() => onCellPress(index)}
        disabled={disabled || !!item}
        highlight={currentPlayer}
      />
    ),
    [onCellPress, disabled, currentPlayer]
  );

  return (
    <FlatList
      data={board}
      renderItem={renderItem}
      keyExtractor={(_, i) => String(i)}
      numColumns={3}
      scrollEnabled={false}
      contentContainerStyle={styles.board}
    />
  );
}

/**
 * A single cell in the board.
 * Implements smooth scale feedback on press and uses theme accents.
 */
function Cell({
  value,
  onPress,
  disabled,
  highlight,
}: {
  value: CellValue;
  onPress: () => void;
  disabled: boolean;
  highlight: Player;
}) {
  const pressedAnim = React.useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.timing(pressedAnim, {
      toValue: 1,
      duration: 90,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };
  const handlePressOut = () => {
    Animated.timing(pressedAnim, {
      toValue: 0,
      duration: 120,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const scale = pressedAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.97],
  });

  // Subtle background cue for current player
  const backgroundColor =
    value === null
      ? 'rgba(37, 99, 235, 0.03)'
      : value === 'X'
      ? 'rgba(37, 99, 235, 0.08)'
      : 'rgba(245, 158, 11, 0.10)';

  const borderColor =
    value === null
      ? 'rgba(17,24,39,0.08)'
      : value === 'X'
      ? 'rgba(37,99,235,0.35)'
      : 'rgba(245,158,11,0.35)';

  return (
    <Animated.View style={[styles.cellWrapper, { transform: [{ scale }] }]}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.cell,
          {
            backgroundColor: pressed ? 'rgba(37,99,235,0.06)' : backgroundColor,
            borderColor,
            shadowOpacity: value ? 0.08 : 0.05,
          },
        ]}
        android_ripple={{ color: 'rgba(37,99,235,0.08)' }}
        accessibilityRole="button"
        accessibilityLabel="board cell"
      >
        <Text
          style={[
            styles.cellText,
            {
              color:
                value === 'X'
                  ? theme.primary
                  : value === 'O'
                  ? theme.secondary
                  : 'rgba(17,24,39,0.25)',
            },
          ]}
        >
          {value ?? (highlight ? '' : '')}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

/**
 * Primary button with minimalistic style and states.
 */
function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'surface';
}) {
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isPrimary
          ? {
              backgroundColor: theme.primary,
            }
          : {
              backgroundColor: theme.surface,
              borderColor: 'rgba(17,24,39,0.08)',
              borderWidth: StyleSheet.hairlineWidth,
            },
        {
          transform: [{ scale: pressed ? 0.98 : 1 }],
          shadowOpacity: pressed ? 0.06 : 0.1,
        },
      ]}
      android_ripple={{
        color: isPrimary ? 'rgba(255,255,255,0.2)' : 'rgba(37,99,235,0.08)',
      }}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text
        style={[
          styles.buttonText,
          { color: isPrimary ? '#ffffff' : theme.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * Calculate winner for Tic Tac Toe.
 * Returns 'X', 'O', 'Draw' (handled by caller), or null.
 */
// PUBLIC_INTERFACE
export function calculateWinner(squares: CellValue[]): Player | null {
  /** Winning lines indexed for 3x3 grid */
  const lines = [
    [0, 1, 2], // rows
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], // columns
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], // diagonals
    [2, 4, 6],
  ] as const;

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

/**
 * Styles - modern, minimalist with rounded corners, subtle shadows, and gradients.
 * Note: RN doesn't support CSS gradients natively; simulate depth via layered surfaces and subtle color overlays.
 */
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 16,
  },
  header: {
    padding: 16,
    paddingTop: 8,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.2,
    marginBottom: 6,
  },
  status: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: 'rgba(17,24,39,0.6)',
  },
  card: {
    backgroundColor: theme.surface,
    borderRadius: 20,
    padding: 12,
    // Subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  cardInset: {
    backgroundColor: '#f3f6fd', // very light bluish tint for "gradient-like" depth
    borderRadius: 16,
    padding: 12,
  },
  board: {
    gap: 10,
    paddingVertical: 4,
  },
  cellWrapper: {
    flex: 1,
    aspectRatio: 1,
    margin: 5,
  },
  cell: {
    flex: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    // Outline
    borderWidth: 1,
    // Subtle shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cellText: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    marginTop: 4,
  },
  button: {
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
    minWidth: 140,
    alignItems: 'center',
    justifyContent: 'center',
    // shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    color: 'rgba(17,24,39,0.45)',
    fontSize: 12,
  },
});
