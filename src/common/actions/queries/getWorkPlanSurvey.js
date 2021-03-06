export default function getWorkPlanSurvey(projectName) {
  return {
    variables: {projectName},
    query: `
      query($projectName:String) {
        getWorkPlanSurvey(projectName:$projectName) {
          id,
          project {
            id,
            name,
            chapter {
              id,
              name,
            },
            cycle {
              id,
              cycleNumber,
            },
          },
          questions {
            id,
            body,
            responseType,
            responseInstructions,
            subjectType,
            subjects {
              id,
              name,
              handle,
              profileUrl,
              avatarUrl,
            },
            response {
              values {
                subjectId,
                value,
              }
            },
            validationOptions {
              min
              max
              sum
              length
              integer
            }
          },
        },
      }
    `,
  }
}
