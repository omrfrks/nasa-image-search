import React from 'react';
import { render, screen,fireEvent } from '@testing-library/react';
import App from './App';
import {BrowserRouter as Router} from 'react-router-dom';

test('show search input', () => {
  render(<App />);
  const searchElement = screen.getByPlaceholderText('Search for nasa images');
  expect(searchElement).toBeInTheDocument();
});

test('search img with no result', async () => {
  render(<App />);
  const searchElement:any = screen.getByPlaceholderText('Search for nasa images');
  fireEvent.change(searchElement, {target: {value: 'asdoamdmnasdmajsndkjandkjan'}})
  fireEvent.keyDown(searchElement, {key: 'Enter', code: 'Enter', charCode: 13})
  expect(await screen.findByText('No results found')).toBeInTheDocument();
});

test('search img with result', async () => {
  render(<Router>
    <App />
  </Router>);
  const searchElement:any = screen.getByPlaceholderText('Search for nasa images');
  fireEvent.change(searchElement, {target: {value: 'GRC-2015-C'}})
  fireEvent.keyDown(searchElement, {key: 'Enter', code: 'Enter', charCode: 13})
  expect(await screen.findByText('GRC-2015-C-00675')).toBeInTheDocument();
});