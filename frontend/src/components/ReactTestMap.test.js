import Map from './Map';
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';


test('Rendering the Map component as soon as the application goes online', () => {
    render(<Map />);
    const ele = screen.getByText("Map component rendered")
    expect(ele).toBeDefined();
  }); 