import application from '../application';
import {INITIAL_STATE} from '../index';
import {ActionTypes} from '../../actions/action-types';

describe('Application reducer test suite', () => {
  test('Application default state', () => {
    const applicationDefaultState = application();
    expect(applicationDefaultState).toHaveProperty('title', 'Isotope Mail Client');
    expect(applicationDefaultState).toHaveProperty('user', {});
    expect(applicationDefaultState).toHaveProperty('newMessage', null);
    expect(applicationDefaultState).toHaveProperty('selectedFolderId', {});
    expect(applicationDefaultState).toHaveProperty('createFolderParentId', null);
    expect(applicationDefaultState).toHaveProperty('renameFolderId', null);
    expect(applicationDefaultState).toHaveProperty('selectedMessage', null);
    expect(applicationDefaultState).toHaveProperty('downloadedMessages', {});
    expect(applicationDefaultState).toHaveProperty('outbox', null);
    expect(applicationDefaultState).toHaveProperty('pollInterval');
    expect(applicationDefaultState).toHaveProperty('errors.diskQuotaExceeded', false);
    expect(applicationDefaultState).toHaveProperty('errors.authentication', null);
    expect(applicationDefaultState).toHaveProperty('refreshMessageActiveRequests', 0);
    expect(applicationDefaultState).toHaveProperty('activeRequests', 0);
  });
  test('APPLICATION_BE_REQUEST', () => {
    const updatedState = application(INITIAL_STATE.application, {type: ActionTypes.APPLICATION_BE_REQUEST});
    expect(updatedState.activeRequests).toBe(1);
  });
  describe('APPLICATION_BE_REQUEST_COMPLETED', () => {
    test('Application BE Request completed (was 0)', () => {
      const updatedState = application(INITIAL_STATE.application, {type: ActionTypes.APPLICATION_BE_REQUEST_COMPLETED});
      expect(updatedState.activeRequests).toBe(0);
    });
    test('Application BE Request completed (was 2)', () => {
      const updatedState = application({...INITIAL_STATE.application, activeRequests: 2},
        {type: ActionTypes.APPLICATION_BE_REQUEST_COMPLETED});
      expect(updatedState.activeRequests).toBe(1);
    });
  });
  test('APPLICATION_USER_CREDENTIALS_CLEAR, user was not null, use should be empty', () => {
    const updatedState = application({...INITIAL_STATE.application, user: {name: 'Luke'}},
      {type: ActionTypes.APPLICATION_USER_CREDENTIALS_CLEAR});
    expect(updatedState.user).toEqual({});
  });
  test('APPLICATION_USER_CREDENTIALS_REFRESH, new encrypted and salt fields, should update user fields', () => {
    // Given
    const initialState = {...INITIAL_STATE.application};
    initialState.user = {credentials: {encrypted: 'Typex', salt: 'AndPepper'}};

    // When
    const updatedState = application(initialState,
      {type: ActionTypes.APPLICATION_USER_CREDENTIALS_REFRESH, payload: {encrypted: 'Enigma', salt: 'Himalayas'}});

    // Then
    expect(initialState).not.toMatchObject(updatedState);
    expect(initialState.user).not.toMatchObject(updatedState.user);
    expect(updatedState.user.credentials.encrypted).toBe('Enigma');
    expect(updatedState.user.credentials.salt).toBe('Himalayas');
  });
  test('APPLICATION_FOLDER_CREATE, createFolderParentId was null, should change', () => {
    const updatedState = application({...INITIAL_STATE.application, createFolderParentId: null},
      {type: ActionTypes.APPLICATION_FOLDER_CREATE, payload: '1337'});
    expect(updatedState.createFolderParentId).toBe('1337');
  });
  test('APPLICATION_FOLDER_RENAME, renameFolderId was null, should change', () => {
    const updatedState = application({...INITIAL_STATE.application, renameFolderId: null},
      {type: ActionTypes.APPLICATION_FOLDER_RENAME, payload: {folderId: '1337'}});
    expect(updatedState.renameFolderId).toBe('1337');
  });
  describe('APPLICATION_FOLDER_RENAME_OK', () => {
    test('Current selectedFolderId wsa renamed folder, should change value', () => {
      const updatedState = application({...INITIAL_STATE.application, selectedFolderId: '1337'},
        {type: ActionTypes.APPLICATION_FOLDER_RENAME_OK, payload:
            {oldFolderId: '1337', newFolderId: '313373'}});
      expect(updatedState.selectedFolderId).toBe('313373');
    });
    test('Current selectedFolderId is NOT renamed folder, should NOT change value', () => {
      const updatedState = application({...INITIAL_STATE.application, selectedFolderId: '1337'},
        {type: ActionTypes.APPLICATION_FOLDER_RENAME_OK, payload:
            {oldFolderId: '313373', newFolderId: '313373R8'}});
      expect(updatedState.selectedFolderId).toBe('1337');
    });
  });
  test('APPLICATION_MESSAGE_REFRESH_BE_REQUEST', () => {
    const updatedState = application(INITIAL_STATE.application,
      {type: ActionTypes.APPLICATION_MESSAGE_REFRESH_BE_REQUEST});
    expect(updatedState.refreshMessageActiveRequests).toBe(1);
  });
  describe('APPLICATION_MESSAGE_REFRESH_BE_REQUEST_COMPLETED', () => {
    test('Application Message Refresh BE Request completed (was 0)', () => {
      const updatedState = application(INITIAL_STATE.application,
        {type: ActionTypes.APPLICATION_MESSAGE_REFRESH_BE_REQUEST_COMPLETED});
      expect(updatedState.refreshMessageActiveRequests).toBe(0);
    });
    test('Application Message Refresh BE Request completed (was 2)', () => {
      const updatedState = application({...INITIAL_STATE.application, refreshMessageActiveRequests: 2},
        {type: ActionTypes.APPLICATION_MESSAGE_REFRESH_BE_REQUEST_COMPLETED});
      expect(updatedState.refreshMessageActiveRequests).toBe(1);
    });
  });
});
