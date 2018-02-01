import { ISeries } from '../../common/model';
import * as sa from './series.action';
import { createEntities } from '../helpers';

export interface SeriesEntities {
  entities: { [id: string]: ISeries };
  loaded: boolean;
  loading: boolean;
}

export const initialState: SeriesEntities = {
  entities: {},
  loaded: false,
  loading: false
};

export function seriesReducer(
  state = initialState,
  action: sa.SeriesAction
): SeriesEntities {
  switch (action.type) {
    case sa.LOAD_SERIES:
    case sa.QUERY_SERIES: {
      return {
        ...state,
        loading: true
      };
    }
    case sa.LOAD_SERIES_SUCCESS:
    case sa.CREATE_SERIES_SUCCESS:
    case sa.UPDATE_SERIES_SUCCESS: {
      const entity = action.payload;
      const id = entity._id;
      return {
        loading: false,
        loaded: true,
        entities: {
          ...state.entities,
          [id]: entity
        }
      };
    }
    case sa.LOAD_SERIES_FAIL:
    case sa.QUERY_SERIES_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }
    case sa.QUERY_SERIES_SUCCESS: {
      const entities = createEntities(
        action.payload,
        s => s._id,
        state.entities
      );

      return {
        ...state,
        loading: false,
        loaded: true,
        entities
      };
    }
    case sa.DELETE_SERIES_SUCCESS: {
      const id = action.payload;
      const { [id]: removeEntities, ...entities } = state.entities;
      return {
        ...state,
        entities
      };
    }
  }
  return state;
}