import React, { ReactElement, ReactNode, useState } from 'react'
import { nanoid } from 'nanoid'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { TitleWithNoTopMargin } from 'components/atoms'
import { TTraffic } from 'localTypes/rules'
import { STATUSES } from 'constants/rules'
import { AddModal } from '../../../../atoms'

type TRulesBlockProps<T> = {
  title: string
  table: ReactNode
  direction: 'Ingress' | 'Egress'
  ruleConfig: {
    isSg?: boolean
    isFqdn?: boolean
    isCidr?: boolean
    isPorts?: boolean
    isTransport?: boolean
    isIcmp?: boolean
    isTrace?: boolean
  }
  rules: T[]
  setRules: ActionCreatorWithPayload<T[]>
  legacyOptions?: {
    centerSg?: string
    rulesOtherside: T[]
    setRulesOtherside: ActionCreatorWithPayload<T[]>
  }
  defaultTraffic?: TTraffic
  defaultPrioritySome?: string
  isDisabled?: boolean
}

export const RulesBlock = <T extends { sg?: string; prioritySome?: string | number }>({
  title,
  table,
  direction,
  rules,
  setRules,
  defaultTraffic,
  legacyOptions,
  ruleConfig,
  defaultPrioritySome,
  isDisabled,
}: TRulesBlockProps<T>): ReactElement => {
  const [addOpen, setAddOpen] = useState(false)
  const dispatch = useDispatch()

  const addNew = (values: T) => {
    dispatch(
      setRules([
        ...rules,
        {
          id: nanoid(),
          ...values,
          traffic: defaultTraffic || null,
          initialValues: { ...values, formChanges: null, id: null },
          prioritySome:
            values.prioritySome && typeof values.prioritySome === 'string' && values.prioritySome.length > 0
              ? Number(values.prioritySome)
              : undefined,
          formChanges: {
            status: STATUSES.new,
          },
        },
      ]),
    )
    /* remove as legacy after only ie-sg-sg will remain */
    if (legacyOptions) {
      if (values.sg === legacyOptions.centerSg) {
        dispatch(
          legacyOptions.setRulesOtherside([
            ...legacyOptions.rulesOtherside,
            {
              ...values,
              initialValues: { ...values, formChanges: null, id: null },
              formChanges: {
                status: STATUSES.new,
              },
            },
          ]),
        )
      }
    }
    /* end of remove block */
  }

  return (
    <>
      <TitleWithNoTopMargin level={4}>{title}</TitleWithNoTopMargin>
      {table}
      <Button type="dashed" block icon={<PlusOutlined />} disabled={isDisabled}>
        Add
      </Button>
      <AddModal<T>
        open={addOpen}
        direction={direction}
        hide={() => setAddOpen(false)}
        addNew={addNew}
        defaultPrioritySome={defaultPrioritySome}
        {...ruleConfig}
      />
    </>
  )
}
