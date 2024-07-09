import React, { FC } from 'react'
import { RULES_CONFIGS_FOR_FACTORY } from '../../constants'
import { RulesBlockFactory } from '../../organisms'

type TRulesByTypeProps = {
  typeId: string
  subType: string
}

export const RulesByType: FC<TRulesByTypeProps> = ({ typeId, subType }) => {
  return (
    <>
      {typeId === 'sgSg' && subType === 'TCP/UDP' && (
        <>
          <RulesBlockFactory {...RULES_CONFIGS_FOR_FACTORY.sgSg.from} isDisabledDefault />
          <RulesBlockFactory {...RULES_CONFIGS_FOR_FACTORY.sgSg.to} isDisabledDefault />
        </>
      )}
      {typeId === 'sgSg' && subType === 'ICMP' && (
        <>
          <RulesBlockFactory {...RULES_CONFIGS_FOR_FACTORY.sgSgIcmp.from} />
          <RulesBlockFactory {...RULES_CONFIGS_FOR_FACTORY.sgSgIcmp.to} />
        </>
      )}
      {typeId === 'sgSgIe' && subType === 'TCP/UDP' && (
        <>
          <RulesBlockFactory {...RULES_CONFIGS_FOR_FACTORY.sgSgIe.from} />
          <RulesBlockFactory {...RULES_CONFIGS_FOR_FACTORY.sgSgIe.to} />
        </>
      )}
      {typeId === 'sgSgIe' && subType === 'ICMP' && (
        <>
          <RulesBlockFactory {...RULES_CONFIGS_FOR_FACTORY.sgSgIeIcmp.from} />
          <RulesBlockFactory {...RULES_CONFIGS_FOR_FACTORY.sgSgIeIcmp.to} />
        </>
      )}
      {typeId === 'sgCidr' && subType === 'TCP/UDP' && (
        <>
          <RulesBlockFactory {...RULES_CONFIGS_FOR_FACTORY.sgCidr.from} />
          <RulesBlockFactory {...RULES_CONFIGS_FOR_FACTORY.sgCidr.to} />
        </>
      )}
      {typeId === 'sgCidr' && subType === 'ICMP' && (
        <>
          <RulesBlockFactory {...RULES_CONFIGS_FOR_FACTORY.sgCidrIcmp.from} />
          <RulesBlockFactory {...RULES_CONFIGS_FOR_FACTORY.sgCidrIcmp.to} />
        </>
      )}
      {typeId === 'sgFqdn' && <RulesBlockFactory {...RULES_CONFIGS_FOR_FACTORY.sgFqdn.to} />}
    </>
  )
}
