import styled from 'styled-components'

const Container = styled.div`
  position: absolute;
  left: 240px;
  z-index: 2;
  width: calc(100vw - 288px);
  padding: 24px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 0 24px rgba(23, 49, 65, 0.13);
`

const ExitModalContainer = styled.div`
  position: absolute;
  top: 15px;
  right: 25px;
`

export const Styled = {
  Container,
  ExitModalContainer,
}
