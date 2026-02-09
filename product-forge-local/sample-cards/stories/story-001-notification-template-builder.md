---
title: "Build notification template builder"
type: story
status: Draft
product: WebApp
module: Notifications
client: Acme Corp
team: Platform
parent: email-notification-engine
story_points: null
jira_card: null
source_conversation: null
created: 2026-02-08
updated: 2026-02-08
---

## Background / Context

The Email Notification Engine Epic requires a template management system that allows product teams to create and edit email notification templates without engineering involvement. Currently, all email templates are hardcoded in application source files, meaning any change to notification wording, layout, or styling requires a code change, code review, and deployment. This creates a multi-day bottleneck for what should be a simple content update. Product teams have a backlog of over 20 template change requests that have been waiting for engineering availability.

This story delivers the admin-facing template builder interface and the underlying template storage and rendering engine. Templates created through this builder will be used by the email delivery pipeline (Story 002) to render notification emails at send time. The template builder is the first component of the notification platform that product teams will interact with directly, so usability and reliability are critical for adoption.

## Feature Requirements / Functional Behavior

### UI Behavior

- Add a "Notification Templates" section in the WebApp admin area, accessible to users with the Product Admin role.
- The template list view displays all notification templates in a searchable, sortable list showing template name, associated event type, last modified date, and publication status (Draft, Published, Archived).
- Clicking "Create Template" or selecting an existing template opens the template editor, which provides a split-pane view: the left pane contains the template markup editor with syntax highlighting, and the right pane shows a live preview of the rendered template with sample data.
- The template editor supports inserting dynamic content variables from a dropdown menu (e.g., {{recipient.name}}, {{task.title}}, {{task.dueDate}}, {{project.name}}) that populate with sample values in the preview.
- Conditional sections are supported through a block syntax (e.g., {{#if task.isOverdue}}...{{/if}}) that shows or hides content based on notification context, with the preview allowing toggle of condition states to verify both branches.
- The editor provides both HTML and plain-text tabs, with auto-generation of a plain-text version from the HTML content that can be manually refined.
- A "Publish" button saves the template as the active version for its event type. A "Save Draft" button saves changes without making them active. A "Preview Email" button sends a test email to the logged-in admin's email address using sample data.

### Business Rules

- Each notification event type (task_assigned, task_completed, comment_added, deadline_approaching, etc.) can have exactly one published template at a time. Publishing a new template for an event type automatically archives the previously published template.
- Templates are versioned automatically on each save. The delivery pipeline uses the published version at the time a notification is triggered, ensuring that mid-flight notifications are not affected by subsequent template edits.
- Dynamic content variables are validated at save time: if a template references a variable that does not exist in the event type's data schema, a warning is displayed. The template can still be saved but cannot be published until all variables are valid.
- Only users with the Product Admin role can create, edit, or publish templates. Other admin roles can view templates in read-only mode.
- Archived templates are retained for 12 months and can be restored (re-published) at any time during the retention period.

## Acceptance Tests

**Test 1: Create and Publish a New Template**
- **Steps**:
  1. Navigate to Notification Templates in the admin area.
  2. Click "Create Template" and select the "task_assigned" event type.
  3. Enter template content with dynamic variables ({{recipient.name}}, {{task.title}}).
  4. Verify the preview renders with sample data.
  5. Click "Publish."
- **Expected Result**: Template is saved with "Published" status. It appears in the template list as the active template for "task_assigned." Previously published template for this event type (if any) is marked "Archived."

**Test 2: Live Preview with Conditional Sections**
- **Steps**:
  1. Open a template in the editor.
  2. Add a conditional section: {{#if task.isOverdue}}Overdue notice{{/if}}.
  3. Toggle the "task.isOverdue" condition in the preview controls.
- **Expected Result**: Preview shows the "Overdue notice" text when the condition is toggled on, and hides it when toggled off. Both states render correctly.

**Test 3: Invalid Variable Warning**
- **Steps**:
  1. Create a template referencing {{invalid.variable}}.
  2. Attempt to save the template.
  3. Attempt to publish the template.
- **Expected Result**: Save succeeds with a warning: "Template references unknown variable: invalid.variable." Publish is blocked with an error: "Cannot publish template with invalid variables."

**Test 4: Send Test Email Preview**
- **Steps**:
  1. Open a template in the editor.
  2. Click "Preview Email."
  3. Check the admin user's email inbox.
- **Expected Result**: A test email is delivered to the admin's email address, rendered with sample data, within 60 seconds.

**Test 5: Version Preservation for In-Flight Notifications**
- **Steps**:
  1. Publish a template for "task_assigned" with version A content.
  2. Trigger a task assignment notification (queued but not yet sent).
  3. Immediately edit and publish a new version B of the template.
  4. Allow the queued notification to send.
- **Expected Result**: The delivered email uses version A content (the version that was active when the notification was triggered), not version B.

**Test 6: Read-Only Access for Non-Product-Admin Roles**
- **Steps**:
  1. Log in as a user with the "Admin" role but not "Product Admin."
  2. Navigate to Notification Templates.
  3. Open a template.
- **Expected Result**: Template content is visible in read-only mode. Create, Edit, Publish, and Archive buttons are hidden or disabled.

## Implementation Context

- The template rendering engine should use a well-established templating library (Handlebars, Mustache, or similar) rather than a custom implementation, to ensure reliability and reduce maintenance burden.
- Template storage should separate the template content (HTML/text) from metadata (event type, version, status) to enable efficient querying and versioning.
- The live preview should render client-side for responsiveness, but the "Preview Email" feature should render server-side using the same engine that the delivery pipeline uses, to ensure fidelity between preview and actual delivery.
- Consider accessibility for the template editor interface: syntax highlighting should not rely solely on color, and keyboard navigation should be supported throughout the editor workflow.

**Implementation Flexibility:** The technical approach is at engineering's discretion. This story defines required behaviors and outcomes; implementation details should be determined during technical design.
