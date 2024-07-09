import { TFormSgSgRule, TFormSgSgIcmpRule } from 'localTypes/rules'
import { comparePorts } from './comparePorts'

export const findSgSgPair = (
  centerSg: string | undefined,
  values: TFormSgSgRule,
  rulesOtherside: TFormSgSgRule[],
): number => {
  return rulesOtherside.findIndex(
    ({ sg, ports, transport, logs, action, prioritySome }) =>
      sg === centerSg &&
      comparePorts(ports, values.ports) &&
      transport === values.transport &&
      logs === values.logs &&
      action === values.action &&
      prioritySome === values.prioritySome,
  )
}

export const findSgSgIcmpPair = (
  centerSg: string | undefined,
  values: TFormSgSgIcmpRule,
  rulesOtherside: TFormSgSgIcmpRule[],
): number => {
  return rulesOtherside.findIndex(
    ({ sg, IPv, types, logs, trace, action, prioritySome }) =>
      sg === centerSg &&
      IPv === values.IPv &&
      JSON.stringify([...types].sort()) === JSON.stringify([...values.types].sort()) &&
      logs === values.logs &&
      trace === values.trace &&
      action === values.action &&
      prioritySome === values.prioritySome,
  )
}
