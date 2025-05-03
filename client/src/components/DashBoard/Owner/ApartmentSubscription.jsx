import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { SubscriptionDetails } from '../../../utils/DashBoardUtils';
import { Box, Typography, Stack, LinearProgress, Button } from '@mui/material';
import { Tag } from 'antd';
import {
  switchSubscriptions,
  deleteSubscription,
} from '../../../utils/DashBoardUtils';
import { Snackbar } from '@mui/material';

const plans = {
  premium: {
    plan_id: 'plan_PP2wHhUHdXIXfx',
    amount: '20',
  },
  basic: {
    plan_id: 'plan_PP2viHjbgALKtB',
    amount: '10',
  },
};
const ApartmentSubscription = () => {
  const [open, setOpen] = React.useState(false);

  const [conversionPlan, setconversionPlan] = useState(null);
  const [isSubUpdate, setLoading] = useState(false);

  const { apartment_id } = useParams();
  const { data, isError, isLoading } = useQuery({
    queryKey: ['subscription_details', apartment_id],
    queryFn: () => SubscriptionDetails(apartment_id),
    enabled: !!apartment_id,
  });
  const handleClose = () => {
    setOpen(false);
  };
  const handleDateCOnversion = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000);

    const formattedDate = date.toLocaleString();
    return formattedDate;
  };
  useEffect(() => {
    const basicPlan = plans.basic;
    const premiumPlan = plans.premium;
    if (data) {
      if (data.plan_id === basicPlan.plan_id) {
        setconversionPlan('Premium');
      } else if (data.plan_id === premiumPlan.plan_id) {
        setconversionPlan('Basic');
      }
    }
  }, [data]);
  console.log(data);
  const switchSub = () => {
    if (isSubUpdate) return;
    setLoading(true);
    let plan_id =
      conversionPlan === 'Premium'
        ? plans.premium.plan_id
        : plans.basic.plan_id;
    switchSubscriptions(apartment_id, plan_id, data.id)
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  const cancelSub = () => {
    if (isSubUpdate) return;
    setLoading(true);
    deleteSubscription(apartment_id, data.id)
      .then(() => {
        setLoading(false);
        setOpen(true);
      })
      .catch((error) => {
        setLoading(false);
      });
  };
  if (isLoading && !data) {
    <Box>
      <Typography variant="h4">Error</Typography>
      <Typography variant="body1">
        The Subscription is No longer available
      </Typography>
      <Button variant="contained" onClick={() => window.location.reload()}>
        Retry
      </Button>
    </Box>;
  }
  return (
    <Box>
      {isLoading && <Typography>Loading...</Typography>}
      {!isLoading && data && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            padding: '1rem',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            transition: 'background-color 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: 'background.paperHover',
            },
            backgroundColor: 'background.paper',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h4">Apartment Subscription Details</Typography>
          <Box>
            <Stack spacing={2}>
              <Typography variant="h6">Plan ID: {data.plan_id}</Typography>
              {data.plan_id === plans.basic.plan_id ? (
                <Typography variant="h6">Subscription Plan: Basic</Typography>
              ) : (
                <Typography variant="h6">
                  Subscription Plan : Premium
                </Typography>
              )}
              <Typography
                variant="h6"
                sx={{
                  color: 'text.primary',

                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontWeight: 'bold',
                  width: 'fit-content',
                  fontSize: '1rem',
                }}
              >
                Status:{' '}
                {data.status == 'active' ? (
                  <Tag color="success">Active</Tag>
                ) : (
                  <Tag color="error">Inactive</Tag>
                )}
              </Typography>
              <Typography variant="h6">
                Total Billing Cycles : {data.total_count}
              </Typography>

              <Typography variant="h6">
                Subscription Billing Ends On : {data.remaining_count}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  width: '40vw',
                }}
              >
                Subscription Level:
                <LinearProgress
                  variant="determinate"
                  value={(data.total_count - data.remaining_count) * 20}
                />
              </Typography>
              <Typography variant="h6">
                Created At : {handleDateCOnversion(data.created_at)}
              </Typography>

              <Typography variant="h6">
                Cycle Started On : {handleDateCOnversion(data.start_at)}
              </Typography>

              <Typography variant="h6">
                Current Cycle Ends On : {handleDateCOnversion(data.end_at)}
              </Typography>
              <Stack direction={'row'} spacing={2}>
                {/* <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#080808',
                    color: 'white',
                  }}
                  onClick={switchSub}
                  disabled={isSubUpdate}
                >
                  {conversionPlan === 'Basic'
                    ? 'Move to Basic'
                    : 'Upgrade to Premium'}
                </Button> */}
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#080808',
                    color: 'white',
                  }}
                  disabled={isSubUpdate}
                  onClick={cancelSub}
                >
                  Cancel Subscription
                </Button>{' '}
              </Stack>
            </Stack>
            <Snackbar
              open={open}
              autoHideDuration={5000}
              onClose={handleClose}
              message="Subscription closed successfully"
            />
          </Box>
        </Box>
      )}
      {isError && (
        <Typography>Error fetching data, please try again later.</Typography>
      )}
    </Box>
  );
};

export default ApartmentSubscription;
