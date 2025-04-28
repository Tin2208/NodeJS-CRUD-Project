"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("projects", "userIds");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("projects", "userIds", {
      type: integer,
      allowNull: false,
      defaultValue: [],
    });
  },
};
