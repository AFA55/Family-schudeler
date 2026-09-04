import { useOnboardingStore } from '../../store/onboardingStore';

const initialState = useOnboardingStore.getState();

beforeEach(() => {
  useOnboardingStore.setState(initialState, true);
});

describe('onboardingStore', () => {
  // ---- setInterests ----
  describe('setInterests', () => {
    it('persists selected interest ids', () => {
      useOnboardingStore.getState().setInterests(['hiking', 'cooking']);
      expect(useOnboardingStore.getState().interests).toEqual(['hiking', 'cooking']);
    });

    it('replaces the previous list', () => {
      useOnboardingStore.getState().setInterests(['a']);
      useOnboardingStore.getState().setInterests(['b', 'c']);
      expect(useOnboardingStore.getState().interests).toEqual(['b', 'c']);
    });
  });

  // ---- setGoals ----
  describe('setGoals', () => {
    it('persists selected goals', () => {
      useOnboardingStore.getState().setGoals(['spend-more-time', 'try-new']);
      expect(useOnboardingStore.getState().goals).toEqual([
        'spend-more-time',
        'try-new',
      ]);
    });
  });

  // ---- setActivities ----
  describe('setActivities', () => {
    it('sets activityTypes, budget, and recommendations preference', () => {
      useOnboardingStore.getState().setActivities({
        activityTypes: ['indoor', 'outdoor'],
        preferredBudget: 'moderate',
        wantRecommendations: false,
      });

      const state = useOnboardingStore.getState();
      expect(state.activityTypes).toEqual(['indoor', 'outdoor']);
      expect(state.preferredBudget).toBe('moderate');
      expect(state.wantRecommendations).toBe(false);
    });

    it('allows null budget', () => {
      useOnboardingStore.getState().setActivities({
        activityTypes: [],
        preferredBudget: null,
        wantRecommendations: true,
      });
      expect(useOnboardingStore.getState().preferredBudget).toBeNull();
    });
  });

  // ---- setLocation ----
  describe('setLocation', () => {
    it('persists address and travel distance', () => {
      useOnboardingStore.getState().setLocation({
        address: '123 Main St',
        maxTravelDistance: 50,
      });

      const state = useOnboardingStore.getState();
      expect(state.address).toBe('123 Main St');
      expect(state.maxTravelDistance).toBe(50);
    });
  });

  // ---- setCharity ----
  describe('setCharity', () => {
    it('persists country preferences', () => {
      useOnboardingStore.getState().setCharity(['US', 'UK', 'BR']);
      expect(useOnboardingStore.getState().helpCountryPreference).toEqual([
        'US',
        'UK',
        'BR',
      ]);
    });
  });

  // ---- getSubmitData ----
  describe('getSubmitData', () => {
    it('gathers all onboarding fields into one object', () => {
      useOnboardingStore.getState().setInterests(['hiking']);
      useOnboardingStore.getState().setGoals(['bond']);
      useOnboardingStore.getState().setActivities({
        activityTypes: ['outdoor'],
        preferredBudget: 'low',
        wantRecommendations: true,
      });
      useOnboardingStore.getState().setLocation({
        address: '456 Elm St',
        maxTravelDistance: 30,
      });
      useOnboardingStore.getState().setCharity(['JP']);

      const data = useOnboardingStore.getState().getSubmitData();

      expect(data).toEqual({
        interests: ['hiking'],
        goals: ['bond'],
        activityTypes: ['outdoor'],
        preferredBudget: 'low',
        wantRecommendations: true,
        address: '456 Elm St',
        maxTravelDistance: 30,
        helpCountryPreference: ['JP'],
      });
    });

    it('returns initial defaults when nothing was set', () => {
      const data = useOnboardingStore.getState().getSubmitData();

      expect(data).toEqual({
        interests: [],
        goals: [],
        activityTypes: [],
        preferredBudget: null,
        wantRecommendations: true,
        address: '',
        maxTravelDistance: 25,
        helpCountryPreference: [],
      });
    });

    it('does not include store methods in the returned object', () => {
      const data = useOnboardingStore.getState().getSubmitData();
      const keys = Object.keys(data);
      expect(keys).not.toContain('setInterests');
      expect(keys).not.toContain('reset');
      expect(keys).not.toContain('getSubmitData');
    });
  });

  // ---- reset ----
  describe('reset', () => {
    it('clears all fields back to defaults', () => {
      useOnboardingStore.getState().setInterests(['hiking', 'cooking']);
      useOnboardingStore.getState().setGoals(['bond']);
      useOnboardingStore.getState().setActivities({
        activityTypes: ['outdoor'],
        preferredBudget: 'high',
        wantRecommendations: false,
      });
      useOnboardingStore.getState().setLocation({
        address: 'Somewhere',
        maxTravelDistance: 100,
      });
      useOnboardingStore.getState().setCharity(['DE']);

      useOnboardingStore.getState().reset();

      const state = useOnboardingStore.getState();
      expect(state.interests).toEqual([]);
      expect(state.goals).toEqual([]);
      expect(state.activityTypes).toEqual([]);
      expect(state.preferredBudget).toBeNull();
      expect(state.wantRecommendations).toBe(true);
      expect(state.address).toBe('');
      expect(state.maxTravelDistance).toBe(25);
      expect(state.helpCountryPreference).toEqual([]);
    });

    it('is idempotent - calling reset twice produces the same state', () => {
      useOnboardingStore.getState().setInterests(['x']);
      useOnboardingStore.getState().reset();
      const first = useOnboardingStore.getState().getSubmitData();

      useOnboardingStore.getState().reset();
      const second = useOnboardingStore.getState().getSubmitData();

      expect(first).toEqual(second);
    });
  });
});
