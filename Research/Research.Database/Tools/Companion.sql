

		declare @UserID int = 104
	
	
		-- Group
		select	G.[GroupID] as [GroupID],
				G.[Name] as [GroupName],
				O.[OrganizationID] as [OrganizationID],
				O.[Name] as [OrganizationName],
				O.[SearchName] as [OrganizationSearchName],
				U.[UnitID] as [UnitID],
				U.[Name] as [UnitName],
				U.[SearchName] as [UnitSearchName],
				UR.[RoleID] as [RoleID],
				R.[Name] as [RoleName],
				UR.[UserRoleID] as [UserRoleID],
				UAR.[IsPrimary] as [IsPrimary],
				UA.[UserID] as [UserID]
		from	(
			select	[UserID],
					[ObjectID],
					[ObjectType],
					[UserAuthorizationID]
			from	[dbo].[tbl_UserAuthorization] with (nolock)
			where	UserID = @UserID
			and		ObjectType = 'group'
		) UA
		inner join [dbo].[tbl_UserAuthorizationRoles] UAR with (nolock) on UA.[UserAuthorizationID]=UAR.[UserAuthorizationID]
		inner join [dbo].[tbl_UserRoles] UR with (nolock) on UR.[UserRoleID]=UAR.[UserRoleID]
		inner join [dbo].[tbl_Role] R with (nolock) on UR.[RoleID]=R.[RoleID] and R.[RoleTypeID]=1
		inner join [dbo].[tbl_Group] G with (nolock) on G.[GroupID]=UA.[ObjectID]
		inner join [dbo].[tbl_GroupRoles] GR with (nolock) on	GR.[GroupID]=G.[GroupID] and GR.[RoleID]=R.[RoleID]
		inner join [dbo].[tbl_Organization] O with (nolock) on O.[GroupID]=G.[GroupID]
		inner join [dbo].[tbl_Unit] U with (nolock) on U.[OrganizationID]=O.[OrganizationID]
		
		
		-- Organization
		select	G.[GroupID] as [GroupID],
				G.[Name] as [GroupName],
				O.[OrganizationID] as [OrganizationID],
				O.[Name] as [OrganizationName],
				O.[SearchName] as [OrganizationSearchName],
				U.[UnitID] as [UnitID],
				U.[Name] as [UnitName],
				U.[SearchName] as [UnitSearchName],
				UR.[RoleID] as [RoleID],
				R.[Name] as [RoleName],
				UR.[UserRoleID] as [UserRoleID],
				UAR.[IsPrimary] as [IsPrimary],
				UA.[UserID] as [UserID]
		from	(
			select	[UserID],
					[ObjectID],
					[ObjectType],
					[UserAuthorizationID]
			from	[dbo].[tbl_UserAuthorization] with (nolock)
			where	UserID = @UserID
			and		ObjectType = 'organization'
		) UA
		inner join [dbo].[tbl_UserAuthorizationRoles] UAR with (nolock) on UA.[UserAuthorizationID]=UAR.[UserAuthorizationID]
		inner join [dbo].[tbl_UserRoles] UR with (nolock) on UR.[UserRoleID]=UAR.[UserRoleID]
		inner join [dbo].[tbl_Role] R with (nolock) on UR.[RoleID]=R.[RoleID] and R.[RoleTypeID] = 1
		inner join [dbo].[tbl_Organization] O with (nolock) on O.[OrganizationID]=UA.[ObjectID]
		inner join [dbo].[tbl_Group] G with (nolock) on G.[GroupID]=O.[GroupID]
		inner join [dbo].[tbl_GroupRoles] GR with (nolock) on GR.[GroupID]=G.[GroupID] and GR.[RoleID]=R.[RoleID]
		inner join [dbo].[tbl_Unit] U with (nolock) on U.[OrganizationID]=O.[OrganizationID]
	
		-- Parent Group
		select	G.[GroupID] as [GroupID],
				G.[Name] as [GroupName],
				O.[OrganizationID] as [OrganizationID],
				O.[Name] as [OrganizationName],
				O.[SearchName] as [OrganizationSearchName],
				U.[UnitID] as [UnitID],
				U.[Name] as [UnitName],
				U.[SearchName] as [UnitSearchName],
				UR.[RoleID] as [RoleID],
				R.[Name] as [RoleName],
				UR.[UserRoleID] as [UserRoleID],
				UAR.[IsPrimary] as [IsPrimary],
				UA.[UserID] as [UserID]
		from	(
			select	[UserID],
					[ObjectID],
					[ObjectType],
					[UserAuthorizationID]
			from	[dbo].[tbl_UserAuthorization] with (nolock)
			where	UserID = @UserID
			and		ObjectType = 'group'
		) UA
		inner join [dbo].[tbl_UserAuthorizationRoles] UAR with (nolock) on UA.[UserAuthorizationID]=UAR.[UserAuthorizationID]
		inner join [dbo].[tbl_UserRoles] UR with (nolock) on UR.[UserRoleID]=UAR.[UserRoleID]
		inner join [dbo].[tbl_Role] R with (nolock) on UR.[RoleID]=R.[RoleID] and R.[RoleTypeID]=1
		inner join [dbo].[tbl_Group] G with (nolock) on G.[ParentID]=UA.[ObjectID]
		inner join [dbo].[tbl_GroupRoles] GR with (nolock) on GR.[GroupID]=G.[GroupID] and GR.[RoleID]=R.[RoleID]
		inner join [dbo].[tbl_Organization] O with (nolock) on O.[GroupID]=G.[GroupID]
		inner join [dbo].[tbl_Unit] U with (nolock) on U.[OrganizationID]=O.[OrganizationID]
		
		
		-- Unit
		select	G.[GroupID] as [GroupID],
				G.[Name] as [GroupName],
				O.[OrganizationID] as [OrganizationID],
				O.[Name] as [OrganizationName],
				O.[SearchName] as [OrganizationSearchName],
				U.[UnitID] as [UnitID],
				U.[Name] as [UnitName],
				U.[SearchName] as [UnitSearchName],
				UR.[RoleID] as [RoleID],
				R.[Name] as [RoleName],
				UR.[UserRoleID] as [UserRoleID],
				UAR.[IsPrimary] as [IsPrimary],
				UA.[UserID] as [UserID]
		from	(
			select	[UserID],
					[ObjectID],
					[ObjectType],
					[UserAuthorizationID]
			from	[dbo].[tbl_UserAuthorization] with (nolock)
			where	UserID = @UserID
			and		ObjectType = 'unit'
		) UA
		inner join [dbo].[tbl_UserAuthorizationRoles] UAR with (nolock) on UA.[UserAuthorizationID]=UAR.[UserAuthorizationID]
		inner join [dbo].[tbl_UserRoles] UR with (nolock) on UR.[UserRoleID]=UAR.[UserRoleID]
		inner join [dbo].[tbl_Role] R with (nolock) on UR.[RoleID]=R.[RoleID] and R.[RoleTypeID] = 1
		inner join [dbo].[tbl_Unit] U with (nolock) on U.[UnitID]=UA.[ObjectID]
		inner join [dbo].[tbl_Organization] O with (nolock) on U.[OrganizationID]=O.[OrganizationID]
		inner join [dbo].[tbl_Group] G with (nolock) on G.[GroupID]=O.[GroupID]
		inner join [dbo].[tbl_GroupRoles] GR with (nolock) on GR.[GroupID]=G.[GroupID] and GR.[RoleID]=R.[RoleID]
		
	