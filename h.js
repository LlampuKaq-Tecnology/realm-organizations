exports = async function (type, id, data) {
  const organizationCollection = context.services
    .get("mongodb-atlas")
    .db("organization")
    .collection("organizations");
  const collection = context.services
    .get("mongodb-atlas")
    .db("user")
    .collection("users");

  async function getOrganization(parameter = {}) {
    return await organizationCollection.findOne(
      {
        $or: [{ project_name: id.bId }, { organizationId: id.bId }],
      },
      { _id: false, ...parameter }
    );
  }

  function createResponse(code, status, res) {
    return {
      code,
      status,
      res,
    };
  }

  async function isAdmin() {
    const business = await getOrganization({ admin: true });
    return business?.admin === id.uId;
  }

  async function isMember() {
    const business = await getOrganization({ members: true });
    const find = business.members.find((x) => x.userId === id.uId);
    return find !== undefined;
  }

  const access = async (callback) => {
    const member = await isMember();
    if (member) {
      return await callback();
    } else {
      return createResponse("401", true, "");
    }
  };

  if (type === "get") {
    return await access(async () => {
      return await getOrganization();
    });
  }

  if (type == "create") {
    const user = await collection.findOneAndUpdate(
      { userId: id.uId },
      {
        $push: {
          organizations: {
            name: data.name,
            organizationId: data.organizationId,
          },
        },
      },
      { returnNewDocument: true }
    );
    await organizationCollection.insertOne(data);
    const organization = await organizationCollection.findOne({
      organizationId: data.organizationId,
    });
    return { user, organization };
  }

  if (type === "update") {
    return await access(async () => {
      return await organizationCollection.findOneAndUpdate(
        { organizationId: id.id },
        { $set: data },
        { returnNewDocument: true }
      );
    });
  }

  if (type === "addMember" || type === "deleteMember") {
    const isA = await isAdmin();
    if (isA) {
      const organization = await organizationCollection.findOneAndUpdate(
        { project_name: id.id },
        type === "addMember"
          ? { $push: { members: { userId: data.user, role: "user" } } }
          : { $pull: { members: { userId: data.user } } },
        { returnNewDocument: true }
      );

      await collection.findOneAndUpdate(
        { userId: data.userId },
        type === "addMember"
          ? {
              $push: [
                {
                  name: organization.name,
                  organizationId: organization.organizationId,
                },
              ],
            }
          : {
              $pull: {
                organizationId: organization.organizationId,
              },
            }
      );

      return { organization };
    }
  }

  if (type === "addPanel" || type === "deletePanel") {
    return await access(async () => {
      return await organizationCollection.findOneAndUpdate(
        { organizationId: id.bId },
        type === "addPanel"
          ? { $push: { panels: data } }
          : { $pull: { panels: id.id } },
        { returnNewDocument: true }
      );
    });
  }
};
