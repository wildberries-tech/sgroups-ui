/* eslint-disable max-lines-per-function */
import React, { FC, useEffect, useState } from 'react'
import { Button, Result, Spin } from 'antd'
import { AxiosError } from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from 'store/store'
import { setRulesSgSgFrom, setRulesSgSgTo } from 'store/editor/rulesSgSg/rulesSgSg'
import { setRulesSgSgIcmpFrom, setRulesSgSgIcmpTo } from 'store/editor/rulesSgSgIcmp/rulesSgSgIcmp'
import { setRulesSgSgIeFrom, setRulesSgSgIeTo } from 'store/editor/rulesSgSgIe/rulesSgSgIe'
import { setRulesSgSgIeIcmpFrom, setRulesSgSgIeIcmpTo } from 'store/editor/rulesSgSgIeIcmp/rulesSgSgIeIcmp'
import { setRulesSgFqdnTo } from 'store/editor/rulesSgFqdn/rulesSgFqdn'
import { setRulesSgCidrFrom, setRulesSgCidrTo } from 'store/editor/rulesSgCidr/rulesSgCidr'
import { setRulesSgCidrIcmpFrom, setRulesSgCidrIcmpTo } from 'store/editor/rulesSgCidrIcmp/rulesSgCidrIcmp'
import { TRequestErrorData, TRequestError } from 'localTypes/api'
import {
  TFormSgSgRule,
  TFormSgSgIcmpRule,
  TFormSgSgIeRule,
  TFormSgSgIeIcmpRule,
  TFormSgFqdnRule,
  TFormSgCidrRule,
  TFormSgCidrIcmpRule,
} from 'localTypes/rules'
import { upsertRules, deleteRules } from 'api/rules'
import { Spacer, TitleWithNoTopMargin } from 'components'
import { getChanges } from './utils/getChanges'
import {
  composeAllTypesOfSgSgRules,
  composeAllTypesOfSgSgIcmpRules,
  composeAllTypesOfSgSgIeRules,
  composeAllTypesOfSgSgIeIcmpRules,
  composeAllTypesOfSgFqdnRules,
  composeAllTypesOfSgCidrRules,
  composeAllTypesOfSgCidrIcmpRules,
} from './utils/composeForSubmit'
import { checkIfSomeChangesMarked } from './utils/checkIfSomeChangesMarked'
import { RulesDiff } from './molecules'
import { Styled } from './styled'

type TChangesBlockProps = {
  centerSg: string
  onClose: () => void
  onSubmit: () => void
}

export const ChangesBlock: FC<TChangesBlockProps> = ({ centerSg, onClose, onSubmit }) => {
  const dispatch = useDispatch()

  const [error, setError] = useState<TRequestError | undefined>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true)

  const rulesSgSgFrom = useSelector((state: RootState) => state.rulesSgSg.rulesFrom)
  const rulesSgSgTo = useSelector((state: RootState) => state.rulesSgSg.rulesTo)
  const rulesSgSgIcmpFrom = useSelector((state: RootState) => state.rulesSgSgIcmp.rulesFrom)
  const rulesSgSgIcmpTo = useSelector((state: RootState) => state.rulesSgSgIcmp.rulesTo)
  const rulesSgSgIeFrom = useSelector((state: RootState) => state.rulesSgSgIe.rulesFrom)
  const rulesSgSgIeTo = useSelector((state: RootState) => state.rulesSgSgIe.rulesTo)
  const rulesSgSgIeIcmpFrom = useSelector((state: RootState) => state.rulesSgSgIeIcmp.rulesFrom)
  const rulesSgSgIeIcmpTo = useSelector((state: RootState) => state.rulesSgSgIeIcmp.rulesTo)
  const rulesSgFqdnTo = useSelector((state: RootState) => state.rulesSgFqdn.rulesTo)
  const rulesSgCidrFrom = useSelector((state: RootState) => state.rulesSgCidr.rulesFrom)
  const rulesSgCidrTo = useSelector((state: RootState) => state.rulesSgCidr.rulesTo)
  const rulesSgCidrIcmpFrom = useSelector((state: RootState) => state.rulesSgCidrIcmp.rulesFrom)
  const rulesSgCidrIcmpTo = useSelector((state: RootState) => state.rulesSgCidrIcmp.rulesTo)

  useEffect(() => {
    const isSomeChangesMarked = checkIfSomeChangesMarked([
      ...rulesSgSgFrom,
      ...rulesSgSgTo,
      ...rulesSgFqdnTo,
      ...rulesSgCidrFrom,
      ...rulesSgCidrTo,
      ...rulesSgSgIcmpFrom,
      ...rulesSgSgIcmpTo,
      ...rulesSgSgIeFrom,
      ...rulesSgSgIeTo,
      ...rulesSgSgIeIcmpFrom,
      ...rulesSgSgIeIcmpTo,
      ...rulesSgCidrIcmpFrom,
      ...rulesSgCidrIcmpTo,
    ])
    if (isSomeChangesMarked) {
      setIsSubmitDisabled(false)
    } else {
      setIsSubmitDisabled(true)
    }
  }, [
    rulesSgSgFrom,
    rulesSgSgTo,
    rulesSgFqdnTo,
    rulesSgCidrFrom,
    rulesSgCidrTo,
    rulesSgSgIcmpFrom,
    rulesSgSgIcmpTo,
    rulesSgSgIeFrom,
    rulesSgSgIeTo,
    rulesSgSgIeIcmpFrom,
    rulesSgSgIeIcmpTo,
    rulesSgCidrIcmpFrom,
    rulesSgCidrIcmpTo,
  ])

  const changesResultSgSgFromResult = getChanges<TFormSgSgRule>(rulesSgSgFrom)
  const changesResultSgSgToResult = getChanges<TFormSgSgRule>(rulesSgSgTo)
  const changesResultSgSgIcmpFrom = getChanges<TFormSgSgIcmpRule>(rulesSgSgIcmpFrom)
  const changesResultSgSgIcmpTo = getChanges<TFormSgSgIcmpRule>(rulesSgSgIcmpTo)
  const changesResultSgSgIeFrom = getChanges<TFormSgSgIeRule>(rulesSgSgIeFrom)
  const changesResultSgSgIeTo = getChanges<TFormSgSgIeRule>(rulesSgSgIeTo)
  const changesResultSgSgIeIcmpFrom = getChanges<TFormSgSgIeIcmpRule>(rulesSgSgIeIcmpFrom)
  const changesResultSgSgIeIcmpTo = getChanges<TFormSgSgIeIcmpRule>(rulesSgSgIeIcmpTo)
  const changesResultSgFqdnTo = getChanges<TFormSgFqdnRule>(rulesSgFqdnTo)
  const changesResultSgCidrFrom = getChanges<TFormSgCidrRule>(rulesSgCidrFrom)
  const changesResultSgCidrTo = getChanges<TFormSgCidrRule>(rulesSgCidrTo)
  const changesResultSgCidrIcmpFrom = getChanges<TFormSgCidrIcmpRule>(rulesSgCidrIcmpFrom)
  const changesResultSgCidrIcmpTo = getChanges<TFormSgCidrIcmpRule>(rulesSgCidrIcmpTo)

  const handleOk = () => {
    const sgSgRules = composeAllTypesOfSgSgRules(
      centerSg,
      rulesSgSgFrom.filter(({ checked }) => checked),
      rulesSgSgTo.filter(({ checked }) => checked),
    )
    const sgSgIcmpRules = composeAllTypesOfSgSgIcmpRules(
      centerSg,
      rulesSgSgIcmpFrom.filter(({ checked }) => checked),
      rulesSgSgIcmpTo.filter(({ checked }) => checked),
    )
    const sgSgIeRules = composeAllTypesOfSgSgIeRules(
      centerSg,
      rulesSgSgIeFrom.filter(({ checked }) => checked),
      rulesSgSgIeTo.filter(({ checked }) => checked),
    )
    const sgSgIeIcmpRules = composeAllTypesOfSgSgIeIcmpRules(
      centerSg,
      rulesSgSgIeIcmpFrom.filter(({ checked }) => checked),
      rulesSgSgIeIcmpTo.filter(({ checked }) => checked),
    )
    const sgFqdnRules = composeAllTypesOfSgFqdnRules(
      centerSg,
      rulesSgFqdnTo.filter(({ checked }) => checked),
    )
    const sgCidrRules = composeAllTypesOfSgCidrRules(
      centerSg,
      rulesSgCidrFrom.filter(({ checked }) => checked),
      rulesSgCidrTo.filter(({ checked }) => checked),
    )
    const sgCidrIcmpRules = composeAllTypesOfSgCidrIcmpRules(
      centerSg,
      rulesSgCidrIcmpFrom.filter(({ checked }) => checked),
      rulesSgCidrIcmpTo.filter(({ checked }) => checked),
    )

    deleteRules(
      sgSgRules.rulesToDelete,
      sgSgIcmpRules.rulesToDelete,
      sgSgIeRules.rulesToDelete,
      sgSgIeIcmpRules.rulesToDelete,
      sgFqdnRules.rulesToDelete,
      sgCidrRules.rulesToDelete,
      sgCidrIcmpRules.rulesToDelete,
    )
      .then(() => {
        // Do not touch: Seuquence is important. Promise.All wont work properly
        upsertRules(
          sgSgRules.rules,
          sgSgIcmpRules.rules,
          sgSgIeRules.rules,
          sgSgIeIcmpRules.rules,
          sgFqdnRules.rules,
          sgCidrRules.rules,
          sgCidrIcmpRules.rules,
        )
          .then(() => {
            setIsLoading(false)
            onSubmit()
          })
          .catch((error: AxiosError<TRequestErrorData>) => {
            setIsLoading(false)
            if (error.response) {
              setError({ status: error.response.status, data: error.response.data })
            } else if (error.status) {
              setError({ status: error.status })
            } else {
              setError({ status: 'Error while fetching' })
            }
          })
      })
      .catch((error: AxiosError<TRequestErrorData>) => {
        setIsLoading(false)
        if (error.response) {
          setError({ status: error.response.status, data: error.response.data })
        } else if (error.status) {
          setError({ status: error.status })
        } else {
          setError({ status: 'Error while fetching' })
        }
      })
  }

  const handleClose = () => {
    const uncheckedRulesSgSgFrom = [...rulesSgSgFrom].map(el => ({ ...el, checked: false }))
    const uncheckedRulesSgSgTo = [...rulesSgSgTo].map(el => ({ ...el, checked: false }))
    const uncheckedRulesSgSgIcmpFrom = [...rulesSgSgIcmpFrom].map(el => ({ ...el, checked: false }))
    const uncheckedRulesSgSgIcmpTo = [...rulesSgSgIcmpTo].map(el => ({ ...el, checked: false }))
    const uncheckedRulesSgSgIeFrom = [...rulesSgSgIeFrom].map(el => ({ ...el, checked: false }))
    const uncheckedRulesSgSgIeTo = [...rulesSgSgIeTo].map(el => ({ ...el, checked: false }))
    const uncheckedRulesSgSgIeIcmpFrom = [...rulesSgSgIeIcmpFrom].map(el => ({ ...el, checked: false }))
    const uncheckedRulesSgSgIeIcmpTo = [...rulesSgSgIeIcmpTo].map(el => ({ ...el, checked: false }))
    const uncheckedRulesSgFqdnTo = [...rulesSgFqdnTo].map(el => ({ ...el, checked: false }))
    const uncheckedRulesSgCidrFrom = [...rulesSgCidrFrom].map(el => ({ ...el, checked: false }))
    const uncheckedRulesSgCidrTo = [...rulesSgCidrTo].map(el => ({ ...el, checked: false }))
    const uncheckedRulesSgCidrIcmpFrom = [...rulesSgCidrIcmpFrom].map(el => ({ ...el, checked: false }))
    const uncheckedRulesSgCidrIcmpTo = [...rulesSgCidrIcmpTo].map(el => ({ ...el, checked: false }))
    dispatch(setRulesSgSgFrom(uncheckedRulesSgSgFrom))
    dispatch(setRulesSgSgTo(uncheckedRulesSgSgTo))
    dispatch(setRulesSgSgIcmpFrom(uncheckedRulesSgSgIcmpFrom))
    dispatch(setRulesSgSgIcmpTo(uncheckedRulesSgSgIcmpTo))
    dispatch(setRulesSgSgIeFrom(uncheckedRulesSgSgIeFrom))
    dispatch(setRulesSgSgIeTo(uncheckedRulesSgSgIeTo))
    dispatch(setRulesSgSgIeIcmpFrom(uncheckedRulesSgSgIeIcmpFrom))
    dispatch(setRulesSgSgIeIcmpTo(uncheckedRulesSgSgIeIcmpTo))
    dispatch(setRulesSgFqdnTo(uncheckedRulesSgFqdnTo))
    dispatch(setRulesSgCidrFrom(uncheckedRulesSgCidrFrom))
    dispatch(setRulesSgCidrTo(uncheckedRulesSgCidrTo))
    dispatch(setRulesSgCidrIcmpFrom(uncheckedRulesSgCidrIcmpFrom))
    dispatch(setRulesSgCidrIcmpTo(uncheckedRulesSgCidrIcmpTo))
    onClose()
  }

  return (
    <>
      <TitleWithNoTopMargin level={3}>Changes for: {centerSg}</TitleWithNoTopMargin>
      <Styled.ScrollContainer>
        {changesResultSgSgFromResult && (
          <RulesDiff
            title="SG From"
            direction="from"
            compareResult={{
              type: 'sgSg',
              data: changesResultSgSgFromResult,
            }}
          />
        )}
        {changesResultSgSgToResult && (
          <RulesDiff
            title="SG To"
            direction="to"
            compareResult={{
              type: 'sgSg',
              data: changesResultSgSgToResult,
            }}
          />
        )}
        {changesResultSgSgIcmpFrom && (
          <RulesDiff
            title="SG-SG-ICMP From"
            direction="from"
            compareResult={{
              type: 'sgSgIcmp',
              data: changesResultSgSgIcmpFrom,
            }}
          />
        )}
        {changesResultSgSgIcmpTo && (
          <RulesDiff
            title="SG-SG-ICMP To"
            direction="to"
            compareResult={{
              type: 'sgSgIcmp',
              data: changesResultSgSgIcmpTo,
            }}
          />
        )}
        {changesResultSgSgIeFrom && (
          <RulesDiff
            title="SG-SG-IE From"
            direction="from"
            compareResult={{
              type: 'sgSgIe',
              data: changesResultSgSgIeFrom,
            }}
          />
        )}
        {changesResultSgSgIeTo && (
          <RulesDiff
            title="SG-SG-IE To"
            direction="to"
            compareResult={{
              type: 'sgSgIe',
              data: changesResultSgSgIeTo,
            }}
          />
        )}
        {changesResultSgSgIeIcmpFrom && (
          <RulesDiff
            title="SG-SG-IE-ICMP From"
            direction="from"
            compareResult={{
              type: 'sgSgIeIcmp',
              data: changesResultSgSgIeIcmpFrom,
            }}
          />
        )}
        {changesResultSgSgIeIcmpTo && (
          <RulesDiff
            title="SG-SG-IE-ICMP To"
            direction="to"
            compareResult={{
              type: 'sgSgIeIcmp',
              data: changesResultSgSgIeIcmpTo,
            }}
          />
        )}
        {changesResultSgFqdnTo && (
          <RulesDiff
            title="FQDN To"
            direction="to"
            compareResult={{
              type: 'sgFqdn',
              data: changesResultSgFqdnTo,
            }}
          />
        )}
        {changesResultSgCidrFrom && (
          <RulesDiff
            title="CIDR-SG From"
            direction="from"
            compareResult={{
              type: 'sgCidr',
              data: changesResultSgCidrFrom,
            }}
          />
        )}
        {changesResultSgCidrTo && (
          <RulesDiff
            title="CIDR-SG To"
            direction="to"
            compareResult={{
              type: 'sgCidr',
              data: changesResultSgCidrTo,
            }}
          />
        )}
        {changesResultSgCidrIcmpFrom && (
          <RulesDiff
            title="CIDR-ICMP From"
            direction="from"
            compareResult={{
              type: 'sgCidrIcmp',
              data: changesResultSgCidrIcmpFrom,
            }}
          />
        )}
        {changesResultSgCidrIcmpTo && (
          <RulesDiff
            title="CIDR-ICMP To"
            direction="to"
            compareResult={{
              type: 'sgCidrIcmp',
              data: changesResultSgCidrIcmpTo,
            }}
          />
        )}
        {!changesResultSgSgFromResult &&
          !changesResultSgSgToResult &&
          !changesResultSgSgIcmpFrom &&
          !changesResultSgSgIcmpTo &&
          !changesResultSgSgIeFrom &&
          !changesResultSgSgIeTo &&
          !changesResultSgSgIeIcmpFrom &&
          !changesResultSgSgIeIcmpTo &&
          !changesResultSgFqdnTo &&
          !changesResultSgCidrFrom &&
          !changesResultSgCidrTo &&
          !changesResultSgCidrIcmpFrom &&
          !changesResultSgCidrIcmpTo && <div>No changes</div>}
      </Styled.ScrollContainer>
      <Spacer />
      <Styled.ButtonsContainer>
        <Button type="default" onClick={handleClose}>
          Cancel
        </Button>
        <Button type="primary" onClick={handleOk} disabled={isSubmitDisabled}>
          Submit
        </Button>
      </Styled.ButtonsContainer>
      {isLoading && <Spin />}
      {error && (
        <Result
          status="error"
          title={error.status}
          subTitle={`Code:${error.data?.code}. Message: ${error.data?.message}`}
        />
      )}
    </>
  )
}
