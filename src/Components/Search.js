import React from 'react';

export const Search = ({ value, onChange, children, onSubmit }) =>
  <form onSubmit={onSubmit}>
    {children} <input
      type='text'
      value={value}
      onChange={onChange}
    />
    <button type='submit'>
     Submit
    </button>
  </form>;
