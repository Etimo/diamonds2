import React from 'react';
import { Table } from './Table';

export const Teams = () => {
  return (
    <div className="flex justify-center">
      <div className="w-1/2">
        <Table
          label="Teams"
          cols={['Name', 'Abbreviation', 'Icon']}
          data={[
            {
              name: 'Chalmers Tekniska Högskola',
              abbreviation: 'chalmers',
              icon: <img src="" alt="school-logo"></img>,
            },
          ]}
        />
      </div>
    </div>
  );
};
