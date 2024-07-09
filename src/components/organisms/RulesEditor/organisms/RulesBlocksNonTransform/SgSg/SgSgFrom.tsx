import React, { FC } from 'react'
import { TcpUdpAndIcmpSwitcher } from '../../../atoms'
import { RulesBlockFactory } from '../../../organisms'
import { RULES_CONFIGS_FOR_FACTORY } from '../../../constants'

export const SgSgFrom: FC = () => {
  return (
    <TcpUdpAndIcmpSwitcher
      notInTransformBlock
      tcpUdpComponent={
        <RulesBlockFactory
          {...RULES_CONFIGS_FOR_FACTORY.sgSg.from}
          addpopoverPosition="top"
          inTransformBlock={false}
          isDisabledDefault
        />
      }
      icmpComponent={
        <RulesBlockFactory
          {...RULES_CONFIGS_FOR_FACTORY.sgSgIcmp.from}
          addpopoverPosition="top"
          inTransformBlock={false}
        />
      }
    />
  )
}
