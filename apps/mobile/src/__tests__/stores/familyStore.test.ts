import { useFamilyStore } from '../../store/familyStore';
import { familyAPI, eventAPI } from '../../lib/api';

const initialState = useFamilyStore.getState();

beforeEach(() => {
  useFamilyStore.setState(initialState, true);
  jest.clearAllMocks();
});

// ---- helpers ----
const mockFamily = (overrides = {}) => ({
  id: 'fam-1',
  name: 'Smiths',
  color: '#FF6B6B',
  inviteCode: 'ABC123',
  memberCount: 3,
  ...overrides,
});

const mockEvent = (overrides = {}) => ({
  id: 'evt-1',
  familyId: 'fam-1',
  title: 'Movie Night',
  startTime: '2026-09-10T19:00:00Z',
  endTime: '2026-09-10T21:00:00Z',
  allDay: false,
  category: 'MOVIE_NIGHT' as const,
  attendees: [],
  ...overrides,
});

describe('familyStore', () => {
  // ---- fetchFamilies ----
  describe('fetchFamilies', () => {
    it('populates families and auto-selects the first as activeFamily', async () => {
      const families = [mockFamily(), mockFamily({ id: 'fam-2', name: 'Johnsons' })];
      (familyAPI.list as jest.Mock).mockResolvedValue({
        data: { families },
      });

      await useFamilyStore.getState().fetchFamilies('user-1');

      const state = useFamilyStore.getState();
      expect(state.families).toEqual(families);
      expect(state.activeFamily).toEqual(families[0]);
      expect(state.isLoading).toBe(false);
    });

    it('keeps existing activeFamily when already set', async () => {
      const existing = mockFamily({ id: 'fam-existing' });
      useFamilyStore.setState({ activeFamily: existing });

      const families = [mockFamily(), mockFamily({ id: 'fam-2' })];
      (familyAPI.list as jest.Mock).mockResolvedValue({ data: { families } });

      await useFamilyStore.getState().fetchFamilies('user-1');

      expect(useFamilyStore.getState().activeFamily).toEqual(existing);
    });

    it('handles response.data as a plain array (no wrapper)', async () => {
      const families = [mockFamily()];
      (familyAPI.list as jest.Mock).mockResolvedValue({ data: families });

      await useFamilyStore.getState().fetchFamilies('user-1');

      expect(useFamilyStore.getState().families).toEqual(families);
    });

    it('re-throws and resets loading on error', async () => {
      (familyAPI.list as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(
        useFamilyStore.getState().fetchFamilies('user-1')
      ).rejects.toThrow('Network error');

      expect(useFamilyStore.getState().isLoading).toBe(false);
    });
  });

  // ---- createFamily ----
  describe('createFamily', () => {
    it('appends the new family to state and returns it', async () => {
      const newFamily = mockFamily({ id: 'fam-new', name: 'New Family' });
      (familyAPI.create as jest.Mock).mockResolvedValue({
        data: { family: newFamily },
      });

      const result = await useFamilyStore
        .getState()
        .createFamily('New Family', '#6366F1', 'user-1');

      expect(result).toEqual(newFamily);
      expect(useFamilyStore.getState().families).toContainEqual(newFamily);
    });

    it('sets activeFamily when none was set before', async () => {
      const newFamily = mockFamily({ id: 'fam-new' });
      (familyAPI.create as jest.Mock).mockResolvedValue({
        data: { family: newFamily },
      });

      await useFamilyStore.getState().createFamily('F', '#000', 'u1');

      expect(useFamilyStore.getState().activeFamily).toEqual(newFamily);
    });
  });

  // ---- fetchEvents ----
  describe('fetchEvents', () => {
    it('fetches events for a date range and stores them', async () => {
      const events = [
        mockEvent(),
        mockEvent({ id: 'evt-2', title: 'Game Night' }),
      ];
      (eventAPI.list as jest.Mock).mockResolvedValue({
        data: { events },
      });

      await useFamilyStore
        .getState()
        .fetchEvents('fam-1', '2026-09-01', '2026-09-30');

      expect(eventAPI.list).toHaveBeenCalledWith('fam-1', '2026-09-01', '2026-09-30');
      expect(useFamilyStore.getState().events).toEqual(events);
      expect(useFamilyStore.getState().isLoading).toBe(false);
    });

    it('replaces previous events on each fetch', async () => {
      useFamilyStore.setState({
        events: [mockEvent({ id: 'old' })],
      });

      const newEvents = [mockEvent({ id: 'new' })];
      (eventAPI.list as jest.Mock).mockResolvedValue({ data: { events: newEvents } });

      await useFamilyStore.getState().fetchEvents('fam-1', '2026-10-01', '2026-10-31');

      expect(useFamilyStore.getState().events).toEqual(newEvents);
    });

    it('handles response.data as a plain array', async () => {
      const events = [mockEvent()];
      (eventAPI.list as jest.Mock).mockResolvedValue({ data: events });

      await useFamilyStore.getState().fetchEvents('fam-1', '2026-09-01', '2026-09-30');

      expect(useFamilyStore.getState().events).toEqual(events);
    });

    it('re-throws and resets loading on error', async () => {
      (eventAPI.list as jest.Mock).mockRejectedValue(new Error('500'));

      await expect(
        useFamilyStore.getState().fetchEvents('fam-1', '2026-09-01', '2026-09-30')
      ).rejects.toThrow('500');

      expect(useFamilyStore.getState().isLoading).toBe(false);
    });
  });

  // ---- createEvent ----
  describe('createEvent', () => {
    it('adds the event to state and returns it', async () => {
      const created = mockEvent({ id: 'evt-created', title: 'Beach Day' });
      (eventAPI.create as jest.Mock).mockResolvedValue({
        data: { event: created },
      });

      const input = {
        familyId: 'fam-1',
        creatorId: 'u1',
        title: 'Beach Day',
        startTime: '2026-09-15T10:00:00Z',
        endTime: '2026-09-15T16:00:00Z',
        category: 'OUTDOOR',
      };

      const result = await useFamilyStore.getState().createEvent(input);

      expect(result).toEqual(created);
      expect(useFamilyStore.getState().events).toContainEqual(created);
      expect(useFamilyStore.getState().isLoading).toBe(false);
    });

    it('preserves existing events when adding a new one', async () => {
      const existing = mockEvent({ id: 'existing' });
      useFamilyStore.setState({ events: [existing] });

      const created = mockEvent({ id: 'new' });
      (eventAPI.create as jest.Mock).mockResolvedValue({
        data: { event: created },
      });

      await useFamilyStore.getState().createEvent({
        familyId: 'fam-1',
        creatorId: 'u1',
        title: 'T',
        startTime: '',
        endTime: '',
        category: 'GENERAL',
      });

      expect(useFamilyStore.getState().events).toHaveLength(2);
    });
  });

  // ---- synchronous helpers ----
  describe('synchronous actions', () => {
    it('addEvent appends to the list', () => {
      const ev = mockEvent();
      useFamilyStore.getState().addEvent(ev);
      expect(useFamilyStore.getState().events).toContainEqual(ev);
    });

    it('removeEvent filters by id', () => {
      useFamilyStore.setState({
        events: [mockEvent({ id: 'a' }), mockEvent({ id: 'b' })],
      });
      useFamilyStore.getState().removeEvent('a');
      expect(useFamilyStore.getState().events).toHaveLength(1);
      expect(useFamilyStore.getState().events[0].id).toBe('b');
    });

    it('setSelectedDate updates the date string', () => {
      useFamilyStore.getState().setSelectedDate('2026-12-25');
      expect(useFamilyStore.getState().selectedDate).toBe('2026-12-25');
    });

    it('setActiveFamily switches the active family', () => {
      const fam = mockFamily({ id: 'fam-switch' });
      useFamilyStore.getState().setActiveFamily(fam);
      expect(useFamilyStore.getState().activeFamily).toEqual(fam);
    });
  });
});
