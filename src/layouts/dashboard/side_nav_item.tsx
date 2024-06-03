import { Box, ButtonBase } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

type Props = {
    active: boolean;
    disabled: boolean;
    external: boolean;
    icon: React.ReactNode;
    path: string;
    title: string;
};

const SideNavItem = (props: Props) => {
    const { active, disabled, external, icon, title } = props;

    const linkProps = props.path
        ? external
            ? {
                  component: 'a',
                  href: props.path,
                  target: '_blank'
              }
            : {
                  component: Link,
                  to: props.path
              }
        : {};
    return (
        <li>
            <ButtonBase
                sx={{
                    alignItems: 'center',
                    borderRadius: 1,
                    display: 'flex',
                    justifyContent: 'flex-start',
                    pl: '16px',
                    pr: '16px',
                    py: '6px',
                    textAlign: 'left',
                    width: '100%',
                    ...(active && {
                        backgroundColor: 'rgba(255, 255, 255, 0.04)'
                    }),
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.04)'
                    }
                }}
                {...linkProps}
            >
                {icon && (
                    <Box
                        component='span'
                        sx={{
                            alignItems: 'center',
                            color: 'neutral.400',
                            display: 'inline-flex',
                            justifyContent: 'center',
                            mr: 2,
                            ...(active && {
                                color: 'primary.main'
                            })
                        }}
                    >
                        {icon}
                    </Box>
                )}
                <Box
                    component='span'
                    sx={{
                        color: 'neutral.400',
                        flexGrow: 1,
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontSize: 14,
                        fontWeight: 600,
                        lineHeight: '24px',
                        whiteSpace: 'nowrap',
                        ...(active && {
                            color: 'common.white'
                        }),
                        ...(disabled && {
                            color: 'neutral.500'
                        })
                    }}
                >
                    {title}
                </Box>
            </ButtonBase>
        </li>
    );
};

export default SideNavItem;
