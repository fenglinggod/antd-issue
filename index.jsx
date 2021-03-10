import React from 'react';
import ReactDOM from 'react-dom';
import Stores from '@/store';
import SearchPanel from '@/index';
import locales from './meta.json';

ReactDOM.render(
  <div style={{ paddingTop: 100 }}>
    <Stores.Provider>
      <SearchPanel locales={locales.i18n} marginTop="mid" />
    </Stores.Provider>
  </div>,

  document.getElementById('root'),
);
