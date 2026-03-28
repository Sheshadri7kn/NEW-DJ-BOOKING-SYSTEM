# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - img "Club lighting" [ref=e7]
    - generic [ref=e9]:
      - generic [ref=e10]:
        - img [ref=e12]
        - generic [ref=e17]: PulseBook
      - generic [ref=e18]:
        - heading "Create Account" [level=1] [ref=e19]
        - paragraph [ref=e20]: Join the exclusive network of top-tier events.
      - generic [ref=e21]:
        - generic [ref=e22]:
          - text: Full Name
          - generic [ref=e23]:
            - img [ref=e24]
            - textbox "Alex Sound" [ref=e27]
        - generic [ref=e28]:
          - text: Email
          - generic [ref=e29]:
            - img [ref=e30]
            - textbox "alex@pulsebook.com" [active] [ref=e33]: ales
        - generic [ref=e34]:
          - text: Password
          - generic [ref=e35]:
            - img [ref=e36]
            - textbox "••••••••" [ref=e39]
        - button "Sign Up" [ref=e40]
      - paragraph [ref=e41]:
        - text: Already have an account?
        - link "Sign in instead" [ref=e42] [cursor=pointer]:
          - /url: /login
  - region "Notifications (F8)":
    - list
```