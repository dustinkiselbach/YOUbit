import React from 'react'
import styled from '../../styled-components'

interface DotProps {
  scrollIndex: number
  idx: number
}

const Dot: React.FC<DotProps> = ({ idx, scrollIndex }) => {
  return <_Dot focused={scrollIndex === idx}></_Dot>
}

const _Dot = styled.View<{ focused: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: ${props => (props.focused ? 'white' : 'rgba(0,0,0,0.5)')};
  margin: 8px;
`

export default Dot
