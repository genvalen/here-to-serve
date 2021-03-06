import React from 'react'
import { Link } from 'react-router-dom'

import Menu from 'react-bulma-components/lib/components/menu';

const SideNavAccount = (props) => {
  return (
    <div>
        <Menu color='white'>
            <Menu.List>
                <Menu.List.Item componentClass='span'>
                    <Link to='/account-settings'>General Account Settings</Link>
                </Menu.List.Item>
                <Menu.List.Item to='/password-settings'>
                  <Link to='/password-settings'>Password Settings</Link>
                </Menu.List.Item>
                <Menu.List.Item componentClass='span'>
                  <Link to='/email-settings'>Email Settings</Link>
                </Menu.List.Item>
            </Menu.List>
        </Menu>
    </div>
  )
}

export default SideNavAccount
