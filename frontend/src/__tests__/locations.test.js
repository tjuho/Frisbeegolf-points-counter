import { MockedProvider } from '@apollo/react-testing';
import React, { Component } from 'react';
import Locations from '../components/Locations'
import { useQuery } from '@apollo/react-hooks';
import { create, act } from "react-test-renderer";


import {
  ALL_LOCATIONS
} from '../querys'
import { warnOnceInDevelopment } from 'apollo-utilities';

const mocks = [
  {
    request: {
      query: ALL_LOCATIONS,
    },
    result: {
      data: {
        allLocations:
          [
            { id: '1', name: 'paikka' }
          ]

      },
    },
  },
]
async function wait(ms = 0) {
  await act(() => {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  });
}
const TestLocations = (props) => {
  const allLocationsQuery = useQuery(ALL_LOCATIONS)
  return (
    <Locations allLocationsQuery={allLocationsQuery} show={true} />
  )

}

const helper = (children, count = 0) => {
  children.forEach(child => {
    console.log(child.type, count)
    if (child.children) {
      helper(child.children, count + 1)
    }
  })
}
describe('app testing', () => {
  it('renders with react test renderer', async () => {
    let testRenderer = null
    act(() => {
      testRenderer = create(
        <MockedProvider mocks={mocks} addTypename={false}>
          <TestLocations />
        </MockedProvider>
      )
    })
    await wait()
    console.log(testRenderer.toJSON())
    const instance = testRenderer.root
    const subInstances = instance.children
    subInstances.forEach(sub => {
      sub.children.forEach(subsub => console.log(subsub.type))
    })
    console.log(instance.children[0].children[0].children[0].type)
    helper(instance.children)
    const td = instance.findByType('td')
    console.log(td.children)
    expect(td.children).toContain('paikka')
    //console.log(instance.findByProps({ "key": "1" }))
  })
})
