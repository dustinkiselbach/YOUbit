import styled from '../../styled-components'

const HabitCompleted = styled.TouchableOpacity<{
  isLogged?: boolean
  future?: boolean
  large?: boolean
}>`
  width: ${({ large }) => (large ? '66px' : '33px')};
  height: ${({ large }) => (large ? '66px' : '33px')};
  border-radius: ${({ large }) => (large ? '66px' : '33px')};
  border: 3px solid ${({ theme }) => theme.colors.colorText};
  margin-right: 16px;
  align-items: center;
  justify-content: center;
  background-color: ${({ isLogged, future, theme }) =>
    isLogged || future ? theme.colors.colorPrimary : 'transparent'};
`
export default HabitCompleted
