# Graph Report - D:\Prog\Java\liken-plataform-frontend  (2026-06-12)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 909 nodes · 1696 edges · 76 communities (66 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `97aba20a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 67|Community 67]]

## God Nodes (most connected - your core abstractions)
1. `useSession()` - 42 edges
2. `formatCurrency()` - 30 edges
3. `apiClient` - 19 edges
4. `Skeleton()` - 17 edges
5. `AdminDashboard()` - 13 edges
6. `Toast` - 12 edges
7. `AccessGate()` - 11 edges
8. `useProjects()` - 11 edges
9. `InvestmentsPage()` - 10 edges
10. `ProjectCard()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `AccountPage()` --calls--> `useSession()`  [EXTRACTED]
  app/dashboard/account/page.tsx → providers/session-provider.tsx
- `ReviewContent()` --calls--> `formatCurrency()`  [INFERRED]
  app/dashboard/admin/projects/[id]/page.tsx → shared/lib/utils.ts
- `ReviewContent()` --calls--> `formatPercent()`  [INFERRED]
  app/dashboard/admin/projects/[id]/page.tsx → shared/lib/utils.ts
- `ActiveCard()` --calls--> `formatCurrency()`  [INFERRED]
  app/dashboard/admin/projects/page.tsx → shared/lib/utils.ts
- `FinishedCard()` --calls--> `formatCurrency()`  [INFERRED]
  app/dashboard/admin/projects/page.tsx → shared/lib/utils.ts

## Import Cycles
- None detected.

## Communities (76 total, 10 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (37): NotificationsDropdown(), UsersTable(), ADMIN_BLOCKED_PREFIXES, adminNavigation, DashboardShell(), matchesAnyPrefix(), navigation, NON_ADMIN_BLOCKED_PREFIXES (+29 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (22): useIsMobile(), Header(), navigation, Sheet(), SheetContent(), SheetDescription(), SheetHeader(), SheetTitle() (+14 more)

### Community 2 - "Community 2"
Cohesion: 0.07
Nodes (36): Action, ActionType, actionTypes, addToRemoveQueue(), dispatch(), genId(), listeners, memoryState (+28 more)

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (9): ButtonGroup(), buttonGroupVariants, Field(), fieldVariants, Item(), ItemMedia(), itemMediaVariants, itemVariants (+1 more)

### Community 4 - "Community 4"
Cohesion: 0.13
Nodes (19): BrandMark(), DotGrid(), EnergyHalo(), GradientBar(), gradientText(), CTA(), Features(), Footer() (+11 more)

### Community 5 - "Community 5"
Cohesion: 0.15
Nodes (17): DividendHistory(), InvestmentHistory(), energyIcons, InvestorDashboard(), stateLabels, sumAmounts(), useMyDividends(), useInvestmentTotal() (+9 more)

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (15): ENERGY_ICONS, ENERGY_LABELS, BuyLknFlow(), RefundCard(), usePreviewInvestment(), STATE_CONFIG, DIVIDEND_DISTRIBUTOR_ABI, ERC20_ABI (+7 more)

### Community 7 - "Community 7"
Cohesion: 0.12
Nodes (13): AuthBackground(), AuthPanel(), AuthPanelProps, CompleteProfileForm(), ProfileForm, profileSchema, emailSchema, EmailVerificationForm() (+5 more)

### Community 8 - "Community 8"
Cohesion: 0.16
Nodes (15): DeveloperRow(), STATUS_CONFIG, useUpdateDeveloperStatus(), useDeposit(), useWallet(), useWalletMovements(), useWithdraw(), Skeleton() (+7 more)

### Community 9 - "Community 9"
Cohesion: 0.13
Nodes (9): EMPTY, ENERGY_TYPES, Dialog(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogTitle() (+1 more)

### Community 10 - "Community 10"
Cohesion: 0.09
Nodes (17): adultRefinement, baseRegisterSchema, FieldErrors, fieldRules, initialForm, matchRefinement, personalFields, personalSchema (+9 more)

### Community 11 - "Community 11"
Cohesion: 0.13
Nodes (13): CreateProjectDialog(), CreateProjectRequest, PROJECTS_KEY, useCreateProject(), ENERGY_ICONS, STATE_CONFIG, EnergyType, OnChainStatus (+5 more)

### Community 12 - "Community 12"
Cohesion: 0.13
Nodes (12): AccountPage(), KYC_CONFIG, PasswordField, TIER_CONFIG, sections, orderBook, recentTrades, tokens (+4 more)

### Community 13 - "Community 13"
Cohesion: 0.14
Nodes (16): getStateLabel(), getStateTone(), ON_CHAIN_STATUS_LABEL, ON_CHAIN_STATUS_TONE, priceLabel(), ProjectCard(), ROUND_STATE_LABEL, ROUND_STATE_TONE (+8 more)

### Community 14 - "Community 14"
Cohesion: 0.18
Nodes (17): PermissionItem, PERMISSIONS_KEY, RoleDetail, ROLES_KEY, useAssignPermissions(), useCreatePermission(), useCreateRole(), useDeletePermission() (+9 more)

### Community 15 - "Community 15"
Cohesion: 0.13
Nodes (8): Audience, AUDIENCE_OPTIONS, Toast, Label(), SelectContent(), SelectItem(), SelectTrigger(), SelectValue()

### Community 16 - "Community 16"
Cohesion: 0.17
Nodes (12): ChangeStateMenu(), ChangeStateMenuProps, STATE_LABEL, useChangeProjectState(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent() (+4 more)

### Community 17 - "Community 17"
Cohesion: 0.15
Nodes (9): MonthlyPoint, PlatformReport, ReportRange, usePlatformReport(), chartData(), FeesBreakdownChart(), ReportContent(), RevenueChart() (+1 more)

### Community 19 - "Community 19"
Cohesion: 0.14
Nodes (7): Theme, ThemeContext, ThemeContextValue, ThemeProvider(), useTheme(), Toaster(), ThemeToggle()

### Community 21 - "Community 21"
Cohesion: 0.17
Nodes (9): ENERGY_ICONS, ENERGY_LABELS, useApproveProject(), useRejectProject(), useProjectDetail(), ProjectDetailPage(), ReviewContent(), getPermissionContext() (+1 more)

### Community 22 - "Community 22"
Cohesion: 0.18
Nodes (10): AdminDashboard(), countByState(), defaultMonthlyRange(), ENERGY_ICONS, formatTokenAmount(), sumProjectAmount(), DeveloperList(), useDevelopers() (+2 more)

### Community 23 - "Community 23"
Cohesion: 0.20
Nodes (9): useProjectsByState(), ACTIVE_STATE_BADGE, ActiveTab(), ENERGY_ICONS, FINISHED_BADGE, FinishedTab(), PendingTab(), ProjectsAdminContent() (+1 more)

### Community 24 - "Community 24"
Cohesion: 0.21
Nodes (9): RoleOption, ApiClientError, attemptRefresh(), getStoredToken(), readCookieToken(), refreshQueue, request(), RequestOptions (+1 more)

### Community 25 - "Community 25"
Cohesion: 0.19
Nodes (12): CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext(), CarouselOptions, CarouselPlugin (+4 more)

### Community 26 - "Community 26"
Cohesion: 0.32
Nodes (8): ClaimDividendsCard(), LinkWalletButton(), WalletStatusCard(), DashboardPage(), usePendingDividends(), useLinkWallet(), formatCompactAddress(), useSession()

### Community 27 - "Community 27"
Cohesion: 0.22
Nodes (10): KEY, KEY, DividendClaimResponse, DividendClaimsPage, InvestmentResponse, InvestmentsPage, InvestmentTotalResponse, PendingDividendsResponse (+2 more)

### Community 28 - "Community 28"
Cohesion: 0.22
Nodes (10): MOVEMENTS_KEY, WALLET_KEY, ApiResponse, PageResponse, DepositRequest, MOVEMENT_LABEL, MovementResponse, WalletMovementsPage (+2 more)

### Community 29 - "Community 29"
Cohesion: 0.19
Nodes (7): DecodedToken, parseSessionToken(), readCookieToken(), readStoredToken(), SessionContext, SessionContextValue, SessionUser

### Community 30 - "Community 30"
Cohesion: 0.31
Nodes (4): Web3Provider(), env, wagmiConfig, SessionProvider()

### Community 31 - "Community 31"
Cohesion: 0.20
Nodes (4): Button(), buttonVariants, PaginationLink(), PaginationLinkProps

### Community 32 - "Community 32"
Cohesion: 0.23
Nodes (9): FormControl(), FormDescription(), FormFieldContext, FormFieldContextValue, FormItemContext, FormItemContextValue, FormLabel(), FormMessage() (+1 more)

### Community 33 - "Community 33"
Cohesion: 0.29
Nodes (5): geistMono, geistSans, metadata, ThemeProvider(), AppProviders()

### Community 35 - "Community 35"
Cohesion: 0.31
Nodes (8): useMyProjects(), MyProjectsContent(), DashboardProjectsPage(), filterTypes, Alert(), AlertDescription(), AlertTitle(), alertVariants

### Community 36 - "Community 36"
Cohesion: 0.29
Nodes (6): dashboardNavigation, NavItem, publicNavigation, AuthRegisterRequest, PermissionContext, SidebarNavProps

### Community 39 - "Community 39"
Cohesion: 0.31
Nodes (6): DEVELOPERS_KEY, DeveloperStatus, apiClient, RoleSummary, UsersPage, UserSummary

### Community 40 - "Community 40"
Cohesion: 0.28
Nodes (4): InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants

### Community 41 - "Community 41"
Cohesion: 0.32
Nodes (4): AccessGate(), AccessGateProps, PageHeader(), PageHeaderProps

### Community 42 - "Community 42"
Cohesion: 0.16
Nodes (8): GoogleAuthButton(), GoogleAuthButtonProps, Window, LoginForm(), loginSchema, benefits, AuthLoginRequest, AuthLoginResponse

### Community 45 - "Community 45"
Cohesion: 0.38
Nodes (5): Button(), ButtonProps, buttonStyles(), EmptyState(), EmptyStateProps

### Community 46 - "Community 46"
Cohesion: 0.43
Nodes (4): ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants

## Knowledge Gaps
- **158 isolated node(s):** `KYC_CONFIG`, `TIER_CONFIG`, `PasswordField`, `Audience`, `AUDIENCE_OPTIONS` (+153 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useSession()` connect `Community 26` to `Community 0`, `Community 1`, `Community 35`, `Community 5`, `Community 6`, `Community 7`, `Community 8`, `Community 41`, `Community 42`, `Community 10`, `Community 12`, `Community 11`, `Community 13`, `Community 21`, `Community 22`, `Community 29`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `Skeleton()` connect `Community 8` to `Community 1`, `Community 35`, `Community 5`, `Community 11`, `Community 14`, `Community 17`, `Community 21`, `Community 22`, `Community 23`, `Community 26`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `apiClient` connect `Community 39` to `Community 0`, `Community 7`, `Community 42`, `Community 10`, `Community 11`, `Community 14`, `Community 15`, `Community 17`, `Community 24`, `Community 26`, `Community 27`, `Community 28`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `useSession()` (e.g. with `ProjectDetailPage()` and `DashboardProjectsPage()`) actually correct?**
  _`useSession()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 4 inferred relationships involving `formatCurrency()` (e.g. with `ProjectDetailPage()` and `ReviewContent()`) actually correct?**
  _`formatCurrency()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `KYC_CONFIG`, `TIER_CONFIG`, `PasswordField` to the rest of the system?**
  _158 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06464646464646465 - nodes in this community are weakly interconnected._