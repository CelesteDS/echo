import React, {Component, PropTypes} from 'react'
import {Link} from 'react-router'

import {Flex} from 'src/common/components/Layout'
import {STAT_DESCRIPTORS} from 'src/common/models/stat'

import styles from './index.scss'

export default class ProjectUserSummary extends Component {
  constructor(props) {
    super(props)
    this.renderSummary = this.renderSummary.bind(this)
    this.renderFeedback = this.renderFeedback.bind(this)
  }

  renderSummary() {
    const {user, userProjectStats} = this.props
    const userStats = userProjectStats || {}
    const userProfilePath = `/users/${user.handle}`
    const userHours = userStats[STAT_DESCRIPTORS.PROJECT_HOURS]
    const blank = '--'
    return (
      <Flex className={styles.summary}>
        <Flex className={styles.column} fill>
          <div className={styles.userAvatar}>
            <Link className={styles.userAvatarLink} to={userProfilePath}>
              <img className={styles.userAvatarImg} src={user.avatarUrl}/>
            </Link>
          </div>
          <div>
            <div>
              <Link className={styles.userLink} to={userProfilePath}>
                <strong>{user.handle}</strong>
              </Link>
            </div>
            <div>{user.name}</div>
            <div>{`${!userHours || isNaN(userHours) ? 'No' : userHours} hours logged`}</div>
          </div>
        </Flex>
        <Flex className={styles.column} fill>
          <Flex className={styles.subcolumn} column>
            <div>{'Contribution'}</div>
            <div>{'Culture'}</div>
            <div>{'Technical'}</div>
            <div>{'Rating'}</div>
            <div>{'XP'}</div>
          </Flex>
          <Flex className={styles.subcolumn} column>
            <div>{userStats[STAT_DESCRIPTORS.RELATIVE_CONTRIBUTION] || blank}</div>
            <div>{userStats[STAT_DESCRIPTORS.CULTURE_CONTRIBUTION] || blank}</div>
            <div>{userStats[STAT_DESCRIPTORS.TECHNICAL_HEALTH] || blank}</div>
            <div>{userStats[STAT_DESCRIPTORS.RATING_ELO] || blank}</div>
            <div>{userStats[STAT_DESCRIPTORS.EXPERIENCE_POINTS] || blank}</div>
          </Flex>
        </Flex>
        <Flex className={styles.column} fill>
          <Flex className={styles.subcolumn} column>
            <div>{'Team Play'}</div>
            <div>{'Focus'}</div>
            <div>{'Friction'}</div>
            <div>{'Leadership'}</div>
            <div>{'Receptiveness'}</div>
          </Flex>
          <Flex className={styles.subcolumn} column>
            <div>{userStats[STAT_DESCRIPTORS.TEAM_PLAY] || blank}</div>
            <div>{userStats[STAT_DESCRIPTORS.RESULTS_FOCUS] || blank}</div>
            <div>{userStats[STAT_DESCRIPTORS.FRICTION_REDUCTION] || blank}</div>
            <div>{userStats[STAT_DESCRIPTORS.FLEXIBLE_LEADERSHIP] || blank}</div>
            <div>{userStats[STAT_DESCRIPTORS.RECEPTIVENESS] || blank}</div>
          </Flex>
        </Flex>
      </Flex>
    )
  }

  renderFeedback() {
    const {userProjectEvaluations} = this.props
    const evaluationItems = (userProjectEvaluations || []).filter(evaluation => (
      evaluation[STAT_DESCRIPTORS.GENERAL_FEEDBACK]
    )).map((evaluation, i) => (
      <div key={i} className={styles.evaluation}>
        {evaluation[STAT_DESCRIPTORS.GENERAL_FEEDBACK]}
      </div>
    ))
    return (
      <div>
        {evaluationItems.length > 0 ? evaluationItems : (
          <div className={styles.evaluation}>
            {'No feedback yet.'}
          </div>
        )}
      </div>
    )
  }

  render() {
    return (
      <Flex className={styles.projectUserSummary} column>
        {this.renderSummary()}
        {this.renderFeedback()}
      </Flex>
    )
  }
}

ProjectUserSummary.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    handle: PropTypes.string,
    avatarUrl: PropTypes.string,
  }),
  userProjectEvaluations: PropTypes.arrayOf(PropTypes.shape({
    [STAT_DESCRIPTORS.GENERAL_FEEDBACK]: PropTypes.string,
  })),
  userProjectStats: PropTypes.shape({
    [STAT_DESCRIPTORS.CULTURE_CONTRIBUTION]: PropTypes.number,
    [STAT_DESCRIPTORS.EXPERIENCE_POINTS]: PropTypes.number,
    [STAT_DESCRIPTORS.FLEXIBLE_LEADERSHIP]: PropTypes.number,
    [STAT_DESCRIPTORS.FRICTION_REDUCTION]: PropTypes.number,
    [STAT_DESCRIPTORS.PROJECT_HOURS]: PropTypes.number,
    [STAT_DESCRIPTORS.RATING_ELO]: PropTypes.number,
    [STAT_DESCRIPTORS.RECEPTIVENESS]: PropTypes.number,
    [STAT_DESCRIPTORS.RELATIVE_CONTRIBUTION]: PropTypes.number,
    [STAT_DESCRIPTORS.RESULTS_FOCUS]: PropTypes.number,
    [STAT_DESCRIPTORS.TEAM_PLAY]: PropTypes.number,
    [STAT_DESCRIPTORS.TECHNICAL_HEALTH]: PropTypes.number,
  }),
}