// Illustrative seed hosts around Andheri, Mumbai. Replace with Supabase rows later.
export const CONNECTORS = ['CCS2', 'Type 2', 'Bharat AC001', 'LEV']
export const DEFAULT_ME = { lat: 19.1197, lng: 72.8468 }
export const DEFAULT_VEHICLE = { model: 'Tata Nexon EV', kwh: 30.2, kmPerKwh: 5.5, type: 'Car' }

export const HOSTS = [
  { id: 1, kind: 'home', name: "Rohan's Home Charger", lat: 19.1252, lng: 72.8402, connector: 'Type 2', kw: 7, price: 12, rating: 4.8, verified: true, response: 0.9 },
  { id: 2, kind: 'public', name: 'CityMall Charging Station', lat: 19.1314, lng: 72.8266, connector: 'CCS2', kw: 50, price: 18, rating: 4.2, verified: true, response: 0.6 },
  { id: 3, kind: 'home', name: "Aman's Home Charger", lat: 19.1105, lng: 72.8711, connector: 'Type 2', kw: 11, price: 14, rating: 4.5, verified: true, response: 0.8 },
  { id: 4, kind: 'home', name: 'Sunrise Society Bay 3', lat: 19.1368, lng: 72.8504, connector: 'CCS2', kw: 22, price: 15, rating: 4.6, verified: true, response: 0.7 },
  { id: 5, kind: 'office', name: 'Lotus Business Park', lat: 19.1081, lng: 72.8362, connector: 'Bharat AC001', kw: 3.3, price: 9, rating: 4.0, verified: false, response: 0.5 },
  { id: 6, kind: 'home', name: "Priya's Home Charger", lat: 19.1462, lng: 72.8801, connector: 'Type 2', kw: 7, price: 13, rating: 4.9, verified: true, response: 0.95 },
  { id: 7, kind: 'public', name: 'Highway Fast Hub', lat: 19.1789, lng: 72.8567, connector: 'CCS2', kw: 60, price: 20, rating: 3.9, verified: true, response: 0.4 },
  { id: 8, kind: 'home', name: 'Karan EV Garage', lat: 19.1180, lng: 72.8560, connector: 'LEV', kw: 3, price: 10, rating: 4.3, verified: false, response: 0.7 }
]
