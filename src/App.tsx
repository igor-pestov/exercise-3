import React, { useEffect, useState } from "react";
import { ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';

import "./index.css";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'https://countries.trevorblades.com'
});

export const App: React.FC<{}> = () => {
  const LIST_COUNTRIES = gql`
  {
    countries {
      name
      code
      emoji
      currency
      languages {
        name
      }
    }
  }
`;
  const LIST_CONTINENT = gql`
{
  continents {
    name
    code
    countries{
      name
      emoji
    }
   }
}
`;
  const [country, setCountry] = useState<string>('US');
  const [continent, setContinet] = useState<string>('AF');

  const resCountries = useQuery(LIST_COUNTRIES, { client });
  const resContinent = useQuery(LIST_CONTINENT, { client });
  const [selectCountry, setSelectCountry] = useState<{ name: string, emoji: string, currency: string, languages: Array<string> }>()
  const [selectContinent, setSelectContinent] = useState<{ name: string, countries: Array<{ name: string, emoji: string }> }>()



  useEffect(() => {

    setSelectCountry(resCountries?.data?.countries?.find((el: { code: string }) => el.code === "US"))
    setSelectContinent(resContinent?.data?.continents?.find((el: { code: string }) => el.code === "AF"))

  }, [resCountries, resContinent])

  return (
    <div className="container">
      <div className="country">

        <select value={country} onChange={event => {
          setSelectCountry(resCountries?.data.countries.find((el: { code: string }) => el.code === event.target.value))
          setCountry(event.target.value)
        }}>
          {resCountries?.data?.countries.map((countr: { code: string, name: string }) => {
            return (
              <option key={countr.code} value={countr.code} >
                {countr.name}
              </option>
            )
          })}
        </select>
        <div className="country-card">
          <span>Name: {selectCountry?.name}</span>
          <span>Flag: {selectCountry?.emoji}</span>
          <span>Currency: {selectCountry?.currency}</span>
          <div style={{ display: "flex", flexDirection: "column" }}>Languages: {selectCountry?.languages?.map((elem: { name: string }) => {
           return <li>{elem.name}</li>
          }
          )}
          </div>
        </div>

      </div>
      <div className="continent">
        <select value={continent} onChange={event => {
          setSelectContinent(resContinent?.data?.continents.find((el: { code: string }) => el.code === event.target.value))
          setContinet(event.target.value)
        }}>
          {resContinent?.data?.continents.map((country: { code: string, name: string }) => {
            return (
              <option key={country.code} value={country.code} >
                {country.name}
              </option>
            )
          })}
        </select>
        <span>{selectContinent?.name}</span>
        <div className="list-countries">
          {selectContinent?.countries.map((country: { name: string, emoji: string }) => {
            return (
              <div key={country.name} className="card-country">
                <span className="countinent_card-emoji">{country.emoji}</span>
                <span className="countinent_card-name">{country.name}</span>
              </div>
            )
          })}
        </div>

      </div>
    </div>)
};
