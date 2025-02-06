import { renderHook, act } from '@testing-library/react';

import { mockEventStoreFactory } from '../utils';

import { useEventStore } from '@/pages/event/stores';
import { useEventOverlapDialog } from '@/pages/event/widgets/EventOverlapDialog/hooks';

const mockSetIsOverlapDialogOpen = vi.fn();
const mockSaveEvent = vi.fn();

vi.mock('@/pages/event/stores', () => ({
  useEventStore: vi.fn(),
  useOverlapDialogStore: () => ({
    setIsOverlapDialogOpen: mockSetIsOverlapDialogOpen,
  }),
}));

describe('useEventOverlapDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const mockEventStore = mockEventStoreFactory();
    (useEventStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockEventStore);
  });

  it('다이얼로그를 닫으면 상태를 false로 변경한다', () => {
    const { result } = renderHook(() => useEventOverlapDialog());

    act(() => {
      result.current.handleClose();
    });

    expect(mockSetIsOverlapDialogOpen).toHaveBeenCalledWith(false);
  });

  it('이벤트 저장 시 이벤트를 저장하고 다이얼로그를 닫는다', () => {
    const { result } = renderHook(() => useEventOverlapDialog());

    act(() => {
      result.current.handleConfirm(mockSaveEvent);
    });

    expect(mockSetIsOverlapDialogOpen).toHaveBeenCalledWith(false);
    expect(mockSaveEvent).toHaveBeenCalled();
  });
});
