import styled from 'styled-components'

type TSpacerProps = {
  $space?: number
  $spaceMob?: number
  $samespace?: boolean
}

export const Spacer = styled.div<TSpacerProps>`
  height: ${({ $space, $spaceMob, $samespace }) => {
    if ($spaceMob) {
      return $spaceMob
    }
    if ($space && $samespace) {
      return $space
    }
    return 25
  }}px;
  width: 100%;

  @media (min-width: 1024px) {
    height: ${({ $space }) => $space ?? '50'}px;
  }
`
