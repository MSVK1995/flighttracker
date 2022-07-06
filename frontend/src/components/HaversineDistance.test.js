import HaversineDist from './HaversineDist';

test('test haversine distance from Dublin Airport', () =>{
    expect(HaversineDist(50.6001, -5.5793, 53.421299, -6.27007)).toBe(317.24)
})
test('test haversine distance from Dublin Airport after 1 minute', () =>{
    expect(HaversineDist(55.2227, -4.7432, 53.421299, -6.27007)).toBe(223.43)
})
test('test haversine distance - 355.03KM', () =>{
    expect(HaversineDist(55.5083, -4.3023, 52.8311, -1.32806)).toBe(355.03)
})