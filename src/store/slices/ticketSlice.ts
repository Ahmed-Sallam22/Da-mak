import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import type { Ticket, TicketsResponse, TicketDetails } from '../../types/ticket';

interface TicketState {
  tickets: Ticket[];
  currentTicket: TicketDetails | null;
  loading: boolean;
  error: string | null;
  count: number;
  next: string | null;
  previous: string | null;
  currentPage: number;
}

const initialState: TicketState = {
  tickets: [],
  currentTicket: null,
  loading: false,
  error: null,
  count: 0,
  next: null,
  previous: null,
  currentPage: 1,
};

// Fetch tickets with pagination
export const fetchTickets = createAsyncThunk<
  TicketsResponse,
  { page?: number; page_size?: number; search?: string } | undefined,
  { rejectValue: string }
>(
  'tickets/fetchTickets',
  async (params = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.page_size) queryParams.append('page_size', params.page_size.toString());
      if (params.search) queryParams.append('search', params.search);

      const url = `tickets/${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      let errorMessage = 'Failed to fetch tickets';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { detail?: string; message?: string; error?: string } } };
        errorMessage = axiosError.response?.data?.detail || 
                      axiosError.response?.data?.message || 
                      axiosError.response?.data?.error ||
                      errorMessage;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// Create ticket
export const createTicket = createAsyncThunk<
  Ticket,
  FormData,
  { rejectValue: string }
>(
  'tickets/createTicket',
  async (ticketData, { rejectWithValue }) => {
    try {
      const response = await api.post('tickets/', ticketData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      let errorMessage = 'Failed to create ticket';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { detail?: string; message?: string; error?: string } } };
        errorMessage = axiosError.response?.data?.detail || 
                      axiosError.response?.data?.message || 
                      axiosError.response?.data?.error ||
                      errorMessage;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// Fetch single ticket details
export const fetchTicketDetails = createAsyncThunk<
  TicketDetails,
  number,
  { rejectValue: string }
>(
  'tickets/fetchTicketDetails',
  async (ticketId, { rejectWithValue }) => {
    try {
      const response = await api.get(`tickets/${ticketId}/`);
      return response.data;
    } catch (error) {
      let errorMessage = 'Failed to fetch ticket details';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { detail?: string; message?: string; error?: string } } };
        errorMessage = axiosError.response?.data?.detail || 
                      axiosError.response?.data?.message || 
                      axiosError.response?.data?.error ||
                      errorMessage;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// Approve ticket
export const approveTicket = createAsyncThunk<
  TicketDetails,
  { ticketId: number; reason: string },
  { rejectValue: string }
>(
  'tickets/approveTicket',
  async ({ ticketId, reason }, { rejectWithValue }) => {
    try {
      const response = await api.post(`tickets/${ticketId}/approve/`, { reason });
      return response.data;
    } catch (error) {
      let errorMessage = 'Failed to approve ticket';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { detail?: string; message?: string; error?: string } } };
        errorMessage = axiosError.response?.data?.detail || 
                      axiosError.response?.data?.message || 
                      axiosError.response?.data?.error ||
                      errorMessage;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// Reject ticket
export const rejectTicket = createAsyncThunk<
  TicketDetails,
  { ticketId: number; reason: string },
  { rejectValue: string }
>(
  'tickets/rejectTicket',
  async ({ ticketId, reason }, { rejectWithValue }) => {
    try {
      const response = await api.post(`tickets/${ticketId}/reject/`, { reason });
      return response.data;
    } catch (error) {
      let errorMessage = 'Failed to reject ticket';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { detail?: string; message?: string; error?: string } } };
        errorMessage = axiosError.response?.data?.detail || 
                      axiosError.response?.data?.message || 
                      axiosError.response?.data?.error ||
                      errorMessage;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

const ticketSlice = createSlice({
  name: 'tickets',
  initialState,
  reducers: {
    clearTicketError: (state) => {
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    clearCurrentTicket: (state) => {
      state.currentTicket = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Tickets
    builder.addCase(fetchTickets.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTickets.fulfilled, (state, action) => {
      state.loading = false;
      state.tickets = action.payload.results;
      state.count = action.payload.count;
      state.next = action.payload.next;
      state.previous = action.payload.previous;
    });
    builder.addCase(fetchTickets.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch tickets';
    });

    // Create Ticket
    builder.addCase(createTicket.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createTicket.fulfilled, (state, action) => {
      state.loading = false;
      state.tickets.unshift(action.payload);
      state.count += 1;
    });
    builder.addCase(createTicket.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to create ticket';
    });

    // Fetch Ticket Details
    builder.addCase(fetchTicketDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTicketDetails.fulfilled, (state, action) => {
      state.loading = false;
      state.currentTicket = action.payload;
    });
    builder.addCase(fetchTicketDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to fetch ticket details';
    });

    // Approve Ticket
    builder.addCase(approveTicket.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(approveTicket.fulfilled, (state, action) => {
      state.loading = false;
      state.currentTicket = action.payload;
    });
    builder.addCase(approveTicket.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to approve ticket';
    });

    // Reject Ticket
    builder.addCase(rejectTicket.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(rejectTicket.fulfilled, (state, action) => {
      state.loading = false;
      state.currentTicket = action.payload;
    });
    builder.addCase(rejectTicket.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Failed to reject ticket';
    });
  },
});

export const { clearTicketError, setCurrentPage, clearCurrentTicket } = ticketSlice.actions;
export default ticketSlice.reducer;
