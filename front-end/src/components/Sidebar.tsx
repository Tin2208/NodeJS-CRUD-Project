"use client";

import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Layout, Menu, Button, Typography, theme } from "antd";
import {
  ProjectOutlined,
  TeamOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import logo from "../assets/icons/logo.svg";

const { Sider } = Layout;
const { Text, Title } = Typography;

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { token } = theme.useToken();

  // Check if the device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Get the current active key based on the location
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.includes("/projects")) return "projects";
    if (path.includes("/users")) return "users";
    return "";
  };

  return (
    <>
      {/* Mobile Toggle Button - Only visible on mobile */}
      {isMobile && (
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{
            position: "fixed",
            top: "16px",
            left: collapsed ? "16px" : "200px",
            zIndex: 101,
            background: token.colorPrimary,
            color: "white",
            border: "none",
            transition: "all 0.2s",
          }}
          size="large"
        />
      )}

      <Sider
        theme="light"
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth={isMobile ? 0 : 80}
        width={250}
        style={{
          overflow: "auto",
          height: "100vh",
          position: isMobile ? "fixed" : "relative",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
          transition: "all 0.2s",
        }}
      >
        {/* Logo and Title */}
        <div
          style={{
            padding: "16px",
            borderBottom: "1px solid #f0f0f0",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <img
            src={logo || "/placeholder.svg"}
            alt="Logo"
            style={{ width: "32px", height: "32px" }}
          />
          {!collapsed && (
            <Title level={5} style={{ margin: 0 }}>
              Project Management
            </Title>
          )}
        </div>

        {/* Navigation */}
        <div style={{ padding: "16px 0" }}>
          {!collapsed && (
            <div style={{ padding: "0 16px", marginBottom: "8px" }}>
              <Text
                type="secondary"
                style={{
                  fontSize: "12px",
                  textTransform: "uppercase",
                  fontWeight: "500",
                  letterSpacing: "0.05em",
                }}
              >
                Main Menu
              </Text>
            </div>
          )}

          <Menu
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            style={{ border: "none" }}
            items={[
              {
                key: "projects",
                icon: <ProjectOutlined />,
                label: <NavLink to="/projects">Project Management</NavLink>,
              },
              {
                key: "users",
                icon: <TeamOutlined />,
                label: <NavLink to="/users">Users Management</NavLink>,
              },
            ]}
          />
        </div>

        {/* Footer */}
        {!collapsed && (
          <div
            style={{
              padding: "16px",
              borderTop: "1px solid #f0f0f0",
              position: "absolute",
              bottom: 0,
              width: "100%",
              background: token.colorBgContainer,
            }}
          >
            <div
              style={{
                padding: "12px 16px",
                background: token.colorPrimaryBg,
                borderRadius: "8px",
              }}
            >
              <Text
                style={{
                  fontSize: "12px",
                  color: token.colorPrimary,
                  fontWeight: "500",
                }}
              >
                Project Management System
              </Text>
              <br />
              <Text type="secondary" style={{ fontSize: "12px" }}>
                v1.0.0
              </Text>
            </div>
          </div>
        )}
      </Sider>

      {/* Overlay for mobile - closes sidebar when clicking outside */}
      {isMobile && !collapsed && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.45)",
            zIndex: 99,
          }}
          onClick={() => setCollapsed(true)}
        />
      )}
    </>
  );
}
