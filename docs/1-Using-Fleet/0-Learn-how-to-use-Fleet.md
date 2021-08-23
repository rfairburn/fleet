# Learn how to use Fleet

> This tutorial assumes that you have a preview environment of Fleet up and running. If you haven't already done so, check out our [Get Started](../../../README.md#try-fleet) guide for instructions on how to start a preview environment of Fleet.

In this tutorial, we'll cover the following concepts:

- [Where to see your devices in Fleet](#where-to-see-your-devices-in-fleet)
- [How to ask questions about your devices](#how-to-ask-questions-about-your-devices)
- [How to enroll your own device](#how-to-enroll-your-own-device)

### Where to see your devices in Fleet

Once you log into Fleet, you are presented with the **Hosts** page.

>In Fleet, devices are referred to as "hosts."

<img src="https://user-images.githubusercontent.com/78363703/130040107-02d0161f-0afe-49db-a9b1-116149ed9814.png" alt="Fleet query search" width="600"/>

On this page you'll see 7 hosts by default. These hosts are simulated Linux devices, and like the Fleet preview environment, they're running locally on your computer in Docker.

### How to ask questions about your devices

With osquery and Fleet, you can ask a multitude of questions to help you manage, monitor, and identify threats on your devices, but if you are just starting out, and unsure of what to ask, Fleet comes baked in with a [query library](https://fleetdm.com/queries) of common questions.

So, let's start by asking the following questions about Fleet's 7 simulated Linux hosts:

1. What version of OpenSSL is installed on each device, if any?

2. Do these devices have a high severity vulnerable version of OpenSSL installed?

These questions can easily be answered, by running the following query: "Detect Linux hosts with high severity vulnerable versions of OpenSSL." 

On the **Queries** page, enter the query name, "Detect Linux hosts with high severity vulnerable versions of OpenSSL," in the search box, select the query from the results table, and navigate to the **Edit or run query** page.


<img src="https://user-images.githubusercontent.com/78363703/128487468-7961c509-d0ba-48be-a0e8-54bfb4c371d5.png" alt="Fleet query search" width="600"/>


On the **Edit or run query** page, open the "Select targets" dropdown, and press the purple "+" icon to the right of "All hosts," to run this query against all hosts enrolled in your Fleet. Then hit the "Run" button to execute the query.  


<img src="https://user-images.githubusercontent.com/78363703/128487638-7d779d89-f3fa-42dd-903f-070dc9347a9b.png" alt="Fleet select targets" width="600"/>

The query may take several seconds to complete, because Fleet has to wait for the osquery agents to respond with results.

> Fleet's query response time is inherently variable because of osquery's heartbeat response time. This helps prevent performance issues on hosts.

When the query has finished, you should see 4 columns and several rows in the "Results" table:


<img src="https://user-images.githubusercontent.com/78363703/128488112-56c762da-5029-42d1-8f5d-e74f22aa39cd.png" alt="Fleet query results" width="600"/>


- The "hostname" column answers: which device responded for a given row of results? 

- The "name" column answers: what is the name of the installed software item? The query we just ran asked for all software items that contain "openssl" in their name, so each row in this column should contain "openssl."

- The "source" column answers: which osquery table is the result coming from? For more information on the table's available in osquery, check out the [osquery schema documentation](https://osquery.io/schema).

- The "version" column answers: which version of the software item was detected on this device?

The "Results" table presented in Fleet answers our first question of interest which was "What version of OpenSSL is installed on each device, if any?"

Now you have the results from your query, you can compare the results from the "version" column to the table below, which includes the high severity vulnerabilities reported by [OpenSSL](https://www.openssl.org/news/vulnerabilities.html).


| OpenSSL version range                                                  | Vulnerability (CVE)                                                                           |
| --------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 1.1.1h-1.1.1j                                             | [CVE-2021-3450](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-3450) |
| 1.1.1-1.1.1j                                              | [CVE-2021-3449](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-3449) |
| 1.1.1-1.1.1h and 1.0.2-1.0.2w                             | [CVE-2020-1971](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2020-1971) |
| 1.1.1d-1.1.1f                                             | [CVE-2020-1967](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2020-1967) |
| 1.1.1-1.1.1d and 1.0.2-1.0.2t                             | [CVE-2019-1551](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2019-1551) |
| 1.1.1-1.1.1c                                              | [CVE-2019-1549](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2019-1549) |
| 1.1.0-1.1.0d                                              | [CVE-2017-3733](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2017-3733) |
| 1.1.0-1.1.0b                                              | [CVE-2016-7054](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2016-7054) |
| 1.1.0 and 1.0.2-1.0.2h and 1.0.1-1.0.1t                   | [CVE-2016-6304](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2016-6304) |
| 1.0.2-1.0.2b and 1.0.1-1.0.1n                             | [CVE-2016-2108](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2016-2108) |
| 1.0.2-1.0.2f and 1.0.1-1.0.1r                             | [CVE-2016-0800](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2016-0800) |
| 1.0.2 and 1.0.1-1.0.1l and 1.0.0-1.0.0q and 0.9.8-0.9.8ze | [CVE-2016-0703](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2016-0703) |
| 1.0.2-1.0.2e                                              | [CVE-2016-0701](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2016-0701) |
| 1.0.2b-1.0.2c and 1.0.1n-1.0.1o                           | [CVE-2015-1793](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2015-1793) |
| 1.0.2                                                     | [CVE-2015-0291](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2015-0291) |
| 1.0.1-1.0.1i                                              | [CVE-2014-3513](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-3513) |
| 1.0.1-1.0.1h                                              | [CVE-2014-3511](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-3511) |
| 1.0.1-1.0.1h                                              | [CVE-2014-3511](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-3511) |

Do any of the simulated, Linux hosts have a high severity vulnerable version of OpenSSL installed? If the answer is yes, don't worry. The devices are running in a simulated Docker environment and do not provide any additional vectors for performing malicious actions against your device.

### How to enroll your own device

To add your own device to Fleet, you'll first need to install the osquery agent. In this tutorial, we'll be using [Orbit](https://github.com/fleetdm/orbit), the recommended agent for Fleet.

1. Make a clone of [Orbit's GitHub repository](https://github.com/fleetdm/orbit). 

> Take note on where your new Orbit directory is located on you device. Knowing this will be helpful when building the Orbit package in step 3.

<img src="https://user-images.githubusercontent.com/78363703/130035034-7363ebe1-f89b-42af-9e88-24db867e8047.png" alt="Clone Orbit repository" width="300"/>

2. In Fleet UI's Host page, hit the "Add new host" button, and copy your Fleet enroll secret (you'll need this in the next step.)

<img src="https://user-images.githubusercontent.com/78363703/130040559-9eb77221-aeba-45ce-8f8a-fb1913d3843b.png" alt="Clone Orbit repository" width="600"/>

3. With [fleetctl preview](http://www.fleetdm.com/get-started) still running, and [Go](https://golang.org/doc/install) 1.16 installed, run the following command (remembering to swap ```YOUR_FLEET_ENROLL_SECRET_HERE``` for the one you copied in the previous step:

``` 
# From within the top-level directory of your cloned Orbit repository…
# Generate a macOS installer pointed at your local Fleet
go run ./cmd/package --type=pkg --fleet-url=localhost:8412 --insecure --enroll-secret=YOUR_FLEET_ENROLL_SECRET_HERE```
```
> If you'd like to build a Windows package, set `--type=msi` in the above command. If you'd like to build a Linux package, set `--type=deb` (Debian, Ubuntu, etc.) or `--type=rpm` (RHEL, CentOS, etc.) in the above command.

A package configured to point at your Fleet instance has now been generated in your local Orbit repository

4. Navigate to your generated package (use ```open .``` from macOS commandline,) then double click on the package, and finally complete the installation walkthrough to enroll your device as a host in Fleet.

> It may take several seconds (≈30s) for your device to enroll. Refresh Fleet UI, and you should now see your local device in your list of hosts.
