import React from 'react'

import styled from '../../styled-components'

const Spacer: React.FC = ({ children }) => {
  return <_Spacer>{children}</_Spacer>
}

const _Spacer = styled.View`
  margin: 16px 0;
`

export default Spacer
