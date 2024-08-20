import { ActionCreatorWithPayload, Dispatch as ReduxDispatch } from '@reduxjs/toolkit'
import { STATUSES } from 'constants/rules'
import { TFormSgSgRule } from 'localTypes/rules'
import { getModifiedFieldsInSgSgRule } from './getModifiedFields'
import { findSgSgPair } from './legacyFindPair'
import { getNumberedPriorty } from './getNumberedPriority'

/* remove newSgRulesOtherside as legacy after only ie-sg-sg will remain */
export const edit = (
  dispatch: ReduxDispatch,
  rulesAll: TFormSgSgRule[],
  setRules: ActionCreatorWithPayload<TFormSgSgRule[]>,
  rulesOtherside: TFormSgSgRule[],
  setRulesOtherside: ActionCreatorWithPayload<TFormSgSgRule[]>,
  centerSg: string | undefined,
  oldValues: TFormSgSgRule,
  values: Omit<TFormSgSgRule, 'prioritySome'> & { prioritySome?: number | string },
  openNotification: (value: string) => void,
): void => {
  const numberedPriorty = getNumberedPriorty(values.prioritySome)
  const newSgRules = [...rulesAll]
  const index = newSgRules.findIndex(({ id }) => id === oldValues.id)
  const newSgRulesOtherside = [...rulesOtherside]
  /* legacy */
  const newSgRulesOthersideIndex =
    values.sg === centerSg ? findSgSgPair(centerSg, newSgRules[index], rulesOtherside) : undefined
  if (newSgRules[index].formChanges?.status === STATUSES.new) {
    newSgRules[index] = {
      ...values,
      initialValues: oldValues.initialValues,
      prioritySome: numberedPriorty,
      formChanges: { status: STATUSES.new },
      id: oldValues.id,
    }
    if (newSgRulesOthersideIndex) {
      newSgRulesOtherside[newSgRulesOthersideIndex] = {
        ...values,
        initialValues: oldValues.initialValues,
        prioritySome: numberedPriorty,
        formChanges: { status: STATUSES.new },
        id: newSgRulesOtherside[newSgRulesOthersideIndex].id,
      }
    }
  } else {
    const modifiedFields = getModifiedFieldsInSgSgRule(newSgRules[index], {
      ...values,
      prioritySome: numberedPriorty,
    })
    if (modifiedFields.length !== 0) {
      newSgRules[index] = {
        ...values,
        initialValues: oldValues.initialValues,
        prioritySome: numberedPriorty,
        formChanges: { status: STATUSES.modified, modifiedFields },
        id: oldValues.id,
      }
      if (newSgRulesOthersideIndex) {
        newSgRulesOtherside[newSgRulesOthersideIndex] = {
          ...values,
          initialValues: oldValues.initialValues,
          prioritySome: numberedPriorty,
          formChanges: { status: STATUSES.modified, modifiedFields },
          id: newSgRulesOtherside[newSgRulesOthersideIndex].id,
        }
      }
    } else {
      newSgRules[index] = {
        ...newSgRules[index].initialValues,
        initialValues: { ...newSgRules[index].initialValues },
        formChanges: undefined,
        id: oldValues.id,
      }
      if (newSgRulesOthersideIndex) {
        newSgRulesOtherside[newSgRulesOthersideIndex] = {
          ...newSgRulesOtherside[newSgRulesOthersideIndex].initialValues,
          initialValues: { ...newSgRulesOtherside[newSgRulesOthersideIndex].initialValues },
          formChanges: undefined,
          id: newSgRulesOtherside[newSgRulesOthersideIndex].id,
        }
      }
    }
  }
  dispatch(setRules(newSgRules))
  if (newSgRulesOthersideIndex) {
    dispatch(setRulesOtherside(newSgRulesOtherside))
  }
  openNotification('Changes Saved')
}

/* remove newSgRulesOtherside as legacy after only ie-sg-sg will remain */
export const remove = (
  dispatch: ReduxDispatch,
  rulesAll: TFormSgSgRule[],
  setRules: ActionCreatorWithPayload<TFormSgSgRule[]>,
  rulesOtherside: TFormSgSgRule[],
  setRulesOtherside: ActionCreatorWithPayload<TFormSgSgRule[]>,
  centerSg: string | undefined,
  oldValues: TFormSgSgRule,
  openNotification: (value: string) => void,
): void => {
  const newSgRules = [...rulesAll]
  const index = newSgRules.findIndex(({ id }) => id === oldValues.id)
  const newSgRulesOtherside = [...rulesOtherside]
  /* legacy */
  const newSgRulesOthersideIndex = findSgSgPair(centerSg, oldValues, rulesOtherside)
  if (newSgRules[index].formChanges?.status === STATUSES.new) {
    dispatch(setRules([...newSgRules.slice(0, index), ...newSgRules.slice(index + 1)]))
    dispatch(
      setRulesOtherside([
        ...newSgRulesOtherside.slice(0, newSgRulesOthersideIndex),
        ...newSgRulesOtherside.slice(newSgRulesOthersideIndex + 1),
      ]),
    )
  } else {
    newSgRules[index] = { ...newSgRules[index], formChanges: { status: STATUSES.deleted } }
    newSgRulesOtherside[newSgRulesOthersideIndex] = {
      ...newSgRulesOtherside[newSgRulesOthersideIndex],
      formChanges: { status: STATUSES.deleted },
    }
    dispatch(setRules(newSgRules))
    dispatch(setRulesOtherside(newSgRulesOtherside))
  }
  openNotification('Rule Deleted')
}

/* remove newSgRulesOtherside as legacy after only ie-sg-sg will remain */
export const restore = (
  dispatch: ReduxDispatch,
  rulesAll: TFormSgSgRule[],
  setRules: ActionCreatorWithPayload<TFormSgSgRule[]>,
  rulesOtherside: TFormSgSgRule[],
  setRulesOtherside: ActionCreatorWithPayload<TFormSgSgRule[]>,
  centerSg: string | undefined,
  oldValues: TFormSgSgRule,
  openNotification: (value: string) => void,
): void => {
  const newSgRules = [...rulesAll]
  const index = newSgRules.findIndex(({ id }) => id === oldValues.id)
  const values = newSgRules[index]
  newSgRules[index] = {
    ...values,
    checked: false,
    formChanges: undefined,
  }
  const newSgRulesOtherside = [...rulesOtherside]
  const newSgRulesOthersideIndex = findSgSgPair(centerSg, oldValues, rulesOtherside)
  const valuesOtherside = newSgRulesOtherside[newSgRulesOthersideIndex]
  newSgRulesOtherside[newSgRulesOthersideIndex] = {
    ...valuesOtherside,
    checked: false,
    formChanges: undefined,
  }
  if (values.formChanges && values.formChanges.modifiedFields && values.formChanges.modifiedFields.length > 0) {
    newSgRules[index] = {
      ...newSgRules[index],
      formChanges: {
        status: STATUSES.modified,
        modifiedFields: values.formChanges?.modifiedFields,
      },
    }
  }
  if (values.formChanges && values.formChanges.modifiedFields && values.formChanges.modifiedFields.length > 0) {
    newSgRulesOtherside[index] = {
      ...newSgRulesOtherside[index],
      formChanges: {
        status: STATUSES.modified,
        modifiedFields: valuesOtherside.formChanges?.modifiedFields,
      },
    }
  }
  dispatch(setRules(newSgRules))
  dispatch(setRulesOtherside(newSgRulesOtherside))
  openNotification('Rule Restored')
}
