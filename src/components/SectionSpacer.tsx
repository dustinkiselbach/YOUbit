import React from 'react'
import styled from '../../styled-components'

const SectionSpacer: React.FC = ({ children }) => {
  return <_SectionSpacer>{children}</_SectionSpacer>
}

const _SectionSpacer = styled.View`
  margin: 16px 0;
`

export default SectionSpacer
