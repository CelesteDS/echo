import yup from 'yup'

export const projectSchema = yup.object().shape({
  chapterIdentifier: yup.string().trim().required().min(3),
  cycleIdentifier: yup.number().integer().required().min(1),
  memberIdentifiers: yup.string().trim().required().test(
    'are-valid-user-identifiers',
    'Invalid user identifier(s)',
    _isValidIdentifierList,
  ),
})

function _isValidIdentifierList(value) {
  return (
    (value || '')
      .split(',')
      .map(v => v.trim())
      .filter(v => v)
  ).length > 0
}
