import React from 'react';
import { Button, Card, Grid, Typography, Box } from '@material-ui/core';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import { Delete, Edit } from '@material-ui/icons';

import { FlipCard } from '../General';
import { useGetEnvironmentConnectionsQuery } from '../../../rtk-query/environments';
import classNames from 'classnames';
import CAN from '@/utils/can';
import { keys } from '@/utils/permission_constants';
import { Checkbox, useTheme } from '@layer5/sistent';
import { UsesSistent } from '@/components/SistentWrapper';

export const formattoLongDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const TransferButton = ({ title, count, onAssign, classes, disabled }) => {
  const theme = useTheme();
  return (
    <Button
      variant="contained"
      color="primary"
      disabled={disabled}
      className={classes.popupButton}
      style={{
        backgroundColor: theme.palette.background.secondary,
      }}
      onClick={onAssign}
    >
      <Grid>
        <Typography className={classes.tabCount}>{count}</Typography>
        <Typography className={classes.tabTitle}>{title}</Typography>
        <SyncAltIcon style={{ position: 'absolute', top: '10px', right: '10px' }} />
      </Grid>
    </Button>
  );
};

/**
 * Renders a environment card component.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.environmentDetails - The details of the environment.
 * @param {string} props.environmentDetails.name - The name of the environment.
 * @param {string} props.environmentDetails.description - The description of the environment.
 * @param {Function} props.onDelete - Function to delete the environment.
 * @param {Function} props.onEdit - Function to edit the environment.
 * @param {Function} props.onSelect - Function to select environment for bulk actions.
 * @param {Function} props.onAssignConnection - Function to open connection assignment modal open.
 * @param {Array} props.selectedEnvironments - Selected environments list for delete.
 * @param {String} props.classes - Styles property names for classes.
 *
 */

const EnvironmentCard = ({
  environmentDetails,
  selectedEnvironments,
  onDelete,
  onEdit,
  onSelect,
  onAssignConnection,
  classes,
}) => {
  const { data: environmentConnections } = useGetEnvironmentConnectionsQuery(
    {
      environmentId: environmentDetails.id,
    },
    { skip: !environmentDetails.id },
  );
  const environmentConnectionsCount = environmentConnections?.total_count || 0;

  const deleted = environmentDetails.deleted_at.Valid;
  const theme = useTheme();
  return (
    <FlipCard
      disableFlip={
        selectedEnvironments?.filter((id) => id == environmentDetails.id).length === 1
          ? true
          : false
      }
      frontComponents={
        <Card
          className={classes.cardWrapper}
          style={{
            minHeight: '320px',
            height: '320px',
            backgroundColor: theme.palette.background.hover,
          }}
        >
          <Grid style={{ display: 'flex', flexDirection: 'row', pb: 1 }}>
            <Typography
              className={classes.name}
              variant="body2"
              onClick={(e) => e.stopPropagation()}
            >
              {environmentDetails?.name}
            </Typography>
          </Grid>
          <Grid
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}
          >
            <Grid xs={12} sm={9} md={12} style={{ display: 'flex', justifyContent: 'flex-start' }}>
              {environmentDetails.description ? (
                <Typography
                  className={classNames(classes.emptyDescription, classes.descriptionLabel)}
                  onClick={(e) => e.stopPropagation()}
                  style={{ marginBottom: { xs: 2, sm: 0 }, paddingRight: { sm: 2, lg: 0 } }}
                >
                  {environmentDetails.description}
                </Typography>
              ) : (
                <Typography
                  className={classes.emptyDescription}
                  onClick={(e) => e.stopPropagation()}
                  style={{ color: 'rgba(122,132,142,1)' }}
                >
                  No description
                </Typography>
              )}
            </Grid>
            <Grid
              xs={12}
              style={{
                paddingTop: '15px',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-end',
                gap: '10px',
              }}
            >
              <Box className={classes.allocationButton} onClick={(e) => e.stopPropagation()}>
                <TransferButton
                  title="Assigned Connections"
                  count={environmentConnectionsCount}
                  onAssign={onAssignConnection}
                  classes={classes}
                  disabled={!CAN(keys.VIEW_CONNECTIONS.action, keys.VIEW_CONNECTIONS.subject)}
                />
              </Box>
              {/* temporary disable workspace allocation button  */}
              {false && (
                <Box className={classes.allocationButton} onClick={(e) => e.stopPropagation()}>
                  <TransferButton
                    title="Assigned Workspaces"
                    count={
                      environmentDetails.workspaces ? environmentDetails.workspaces?.length : 0
                    }
                    onAssign={onAssignConnection}
                    classes={classes}
                    disabled={!CAN(keys.VIEW_WORKSPACE.action, keys.VIEW_WORKSPACE.subject)}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        </Card>
      }
      backComponents={
        <Card
          elevation={2}
          className={classes.cardWrapper}
          style={{
            minHeight: '320px',
            background: 'linear-gradient(180deg, #007366 0%, #000 100%)',
          }}
        >
          <Grid xs={12} style={{ display: 'flex', flexDirection: 'row', height: '40px' }}>
            <Grid xs={6} style={{ display: 'flex', alignItems: 'flex-start' }}>
              <UsesSistent>
                <Checkbox
                  className={classes.bulkSelectCheckbox}
                  onClick={(e) => e.stopPropagation()}
                  onChange={onSelect}
                  disabled={deleted ? true : false}
                />
              </UsesSistent>
              <Typography
                className={classes.cardTitle}
                style={{ color: 'white' }}
                variant="body2"
                onClick={(e) => e.stopPropagation()}
              >
                {environmentDetails?.name}
              </Typography>
            </Grid>
            <Grid
              xs={6}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
              }}
            >
              <Button
                className={classes.iconButton}
                onClick={onEdit}
                disabled={
                  selectedEnvironments?.filter((id) => id == environmentDetails.id).length === 1
                    ? true
                    : !CAN(keys.EDIT_ENVIRONMENT.action, keys.EDIT_ENVIRONMENT.subject)
                }
              >
                <Edit style={{ color: 'white', margin: '0 2px' }} />
              </Button>
              <Button
                className={classes.iconButton}
                onClick={onDelete}
                disabled={
                  selectedEnvironments?.filter((id) => id == environmentDetails.id).length === 1
                    ? true
                    : !CAN(keys.DELETE_ENVIRONMENT.action, keys.DELETE_ENVIRONMENT.subject)
                }
              >
                <Delete style={{ color: 'white', margin: '0 2px' }} />
              </Button>
            </Grid>
          </Grid>
          <Grid style={{ display: 'flex', flexDirection: 'row', color: 'white' }}>
            <Grid xs={6} style={{ textAlign: 'left' }}>
              <Typography
                className={classes.dateLabel}
                variant="span"
                onClick={(e) => e.stopPropagation()}
              >
                Updated At: {formattoLongDate(environmentDetails?.updated_at)}
              </Typography>
            </Grid>
            <Grid xs={6} style={{ textAlign: 'left' }}>
              <Typography
                className={classes.dateLabel}
                variant="span"
                onClick={(e) => e.stopPropagation()}
              >
                Created At: {formattoLongDate(environmentDetails?.created_at)}
              </Typography>
            </Grid>
          </Grid>
        </Card>
      }
    />
  );
};

export default EnvironmentCard;
