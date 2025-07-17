# Breathing Exercise Feature

## Purpose
The 5-minute guided breathing exercise provides users with a visual breathing guide that helps reduce anxiety and stress through structured breathing patterns. The feature uses a water-fill circle animation to guide users through inhale, hold, and exhale phases with precise timing.

## Architecture
### Core Components
- **BreathingExercise**: Main component managing state and animation logic
- **BreathingCircle**: Visual circle with water-fill animation
- **BreathingTimer**: Countdown display integrated into circle center
- **BreathingControls**: Start/stop and audio toggle controls

### Animation System
- **Water-fill effect**: CSS `transform: scaleY()` with `transform-origin: bottom`
- **Phase transitions**: Promise-based sequential breathing phases
- **Timing precision**: 4-7-8 breathing pattern (4s inhale, 7s hold, 8s exhale)

### State Management
- `isActive`: Boolean for exercise running state
- `stageIndex`: Current breathing phase (0=inhale, 1=hold, 2=exhale)
- `countdown`: Timer countdown for current phase
- `totalTime`: Session duration tracking

## Implementation
### Key Components
1. **Breathing Circle Animation**
   - Base circle with overflow hidden
   - Fill element using `scaleY()` transform
   - Smooth transitions with `ease-in-out` timing
   - Color scheme following design system tokens

2. **Phase Logic**
   - Promise-based `breathe()` method for each phase
   - Sequential execution with async/await
   - Proper cleanup on stop/pause

3. **Visual Design**
   - Card-based layout following design system
   - Responsive circle sizing (48x48 to 64x64)
   - Centered timer with primary color text
   - Proper spacing using design tokens

## Usage
Users access the breathing exercise from the Tools page. The interface provides:
- Start/Stop button to control exercise
- Visual circle that fills and empties with breathing
- Countdown timer showing seconds remaining in current phase
- Audio toggle for calming background melody
- Progress bar showing session completion

## API
### Props
- None (self-contained component)

### Methods
- `handleStart()`: Initiates breathing session
- `handleStop()`: Stops session and resets state
- `breathe(stageName, duration, animationClass)`: Executes single breathing phase
- `toggleMusic()`: Controls background audio

## Testing
### Unit Tests
- Phase transition timing accuracy
- State management during start/stop
- Cleanup on component unmount
- Audio context handling

### Integration Tests
- Complete breathing cycle execution
- Progress tracking accuracy
- Log creation on completion

### Accessibility Tests
- Keyboard navigation support
- Screen reader compatibility
- Focus management

## Changelog
### v1.0.0 - Initial Implementation
- Basic circle animation with scale transforms
- 4-7-8 breathing pattern implementation
- Card-based responsive design
- Audio toggle functionality
- Session completion logging 