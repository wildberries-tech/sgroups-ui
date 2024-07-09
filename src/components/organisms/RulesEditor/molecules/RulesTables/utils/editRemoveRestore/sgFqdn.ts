import { Dispatch, SetStateAction } from 'react'
import { ActionCreatorWithPayload, Dispatch as ReduxDispatch } from '@reduxjs/toolkit'
import { STATUSES } from 'constants/rules'
import { TFormSgFqdnRule } from 'localTypes/rules'
import { getModifiedFieldsInSgFqdnRule } from './getModifiedFields'
import { getNumberedPriorty } from './getNumberedPriority'

export const edit = (
  dispatch: ReduxDispatch,
  rulesAll: TFormSgFqdnRule[],
  setRules: ActionCreatorWithPayload<TFormSgFqdnRule[]>,
  oldValues: TFormSgFqdnRule,
  values: Omit<TFormSgFqdnRule, 'prioritySome'> & { prioritySome?: number | string },
  toggleEditPopover: (index: number) => void,
): void => {
  const numberedPriorty = getNumberedPriorty(values.prioritySome)
  const newFqdnRules = [...rulesAll]
  const index = newFqdnRules.findIndex(({ id }) => id === oldValues.id)
  if (newFqdnRules[index].formChanges?.status === STATUSES.new) {
    newFqdnRules[index] = {
      ...values,
      initialValues: oldValues.initialValues,
      prioritySome: numberedPriorty,
      formChanges: { status: STATUSES.new },
      id: oldValues.id,
    }
  } else {
    const modifiedFields = getModifiedFieldsInSgFqdnRule(newFqdnRules[index], {
      ...values,
      prioritySome: numberedPriorty,
    })
    if (modifiedFields.length !== 0) {
      newFqdnRules[index] = {
        ...values,
        initialValues: oldValues.initialValues,
        prioritySome: numberedPriorty,
        formChanges: { status: STATUSES.modified, modifiedFields },
        id: oldValues.id,
      }
    } else {
      newFqdnRules[index] = {
        ...newFqdnRules[index].initialValues,
        initialValues: { ...newFqdnRules[index].initialValues },
        formChanges: undefined,
        id: oldValues.id,
      }
    }
  }
  dispatch(setRules(newFqdnRules))
  toggleEditPopover(index)
}

export const remove = (
  dispatch: ReduxDispatch,
  rulesAll: TFormSgFqdnRule[],
  setRules: ActionCreatorWithPayload<TFormSgFqdnRule[]>,
  oldValues: TFormSgFqdnRule,
  editOpen: boolean[],
  setEditOpen: Dispatch<SetStateAction<boolean[]>>,
  toggleEditPopover: (index: number) => void,
): void => {
  const newFqdnRules = [...rulesAll]
  const index = newFqdnRules.findIndex(({ id }) => id === oldValues.id)
  const newEditOpenRules = [...editOpen]
  if (newFqdnRules[index].formChanges?.status === STATUSES.new) {
    dispatch(setRules([...newFqdnRules.slice(0, index), ...newFqdnRules.slice(index + 1)]))
    toggleEditPopover(index)
    setEditOpen([...newEditOpenRules.slice(0, index), ...newEditOpenRules.slice(index + 1)])
  } else {
    newFqdnRules[index] = { ...newFqdnRules[index], formChanges: { status: STATUSES.deleted } }
    dispatch(setRules(newFqdnRules))
    toggleEditPopover(index)
  }
}

export const restore = (
  dispatch: ReduxDispatch,
  rulesAll: TFormSgFqdnRule[],
  setRules: ActionCreatorWithPayload<TFormSgFqdnRule[]>,
  oldValues: TFormSgFqdnRule,
): void => {
  const newFqdnRules = [...rulesAll]
  const index = newFqdnRules.findIndex(({ id }) => id === oldValues.id)
  const values = newFqdnRules[index]
  newFqdnRules[index] = {
    ...values,
    checked: false,
    formChanges: undefined,
  }
  if (values.formChanges && values.formChanges.modifiedFields && values.formChanges.modifiedFields.length > 0) {
    newFqdnRules[index] = {
      ...newFqdnRules[index],
      formChanges: {
        status: STATUSES.modified,
        modifiedFields: values.formChanges?.modifiedFields,
      },
    }
  }
  dispatch(setRules(newFqdnRules))
}
