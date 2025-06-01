import React, { useEffect, useState } from 'react';

export default function Filter() {

  return (
    <div>
      <label>Autor: </label>
      <input
      type="text"
      value={nameFilter}
      onChange={(e) => setNameFilter(e.target.value)}
      />
    </div>
  );
}
