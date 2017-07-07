import fetch from 'node-fetch';

export async function getGeoDetail() {
  try {
    const res = await fetch('https://geo.getreaction.io/json/');
    return await res.json();
  } catch (err) {
    return null;
  }
}
