import Flights from './Flights';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';


describe("Describing flights component", () =>{
    it('Retrieving flights data from the backend through API call', () => {
        render(<Flights />);
        const ele = screen.getByText("Flights data rendered")
        expect(ele).toBeDefined();
      });
})
 